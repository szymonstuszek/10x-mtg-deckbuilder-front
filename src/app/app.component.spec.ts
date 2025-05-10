import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ]
})
class TestModule {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let oidcSecurityServiceSpy: jasmine.SpyObj<OidcSecurityService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OidcSecurityService', ['checkAuth'], {
      userData$: of({ userData: null }),
      getConfiguration: () => of({}),
      checkAuth: () => of({ isAuthenticated: false })
    });

    await TestBed.configureTestingModule({
      imports: [
        TestModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: OidcSecurityService, useValue: spy }
      ]
    }).compileComponents();

    oidcSecurityServiceSpy = TestBed.inject(OidcSecurityService) as jasmine.SpyObj<OidcSecurityService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize OIDC security service on init', () => {
    component.ngOnInit();
    expect(oidcSecurityServiceSpy.checkAuth).toHaveBeenCalled();
  });

  it('should have correct title', () => {
    expect(component.title).toEqual('dev10x-mtg-deckbuilder');
  });

  it('should render header with logo and title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.app-header');
    expect(header).toBeTruthy();
    expect(compiled.querySelector('h1')?.textContent).toContain('MTG Deck Builder');
  });

  it('should not show navigation when user is not logged in', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.app-nav a');
    expect(navLinks.length).toBe(0);
  });

  it('should show navigation when user is logged in', () => {
    // Update the userData$ observable to simulate logged in user
    (oidcSecurityServiceSpy.userData$ as any).next({ userData: { name: 'Test User' } });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.app-nav a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toContain('Home');
    expect(navLinks[1].textContent).toContain('Decks');
  });

  it('should call logout and clear session storage', () => {
    spyOn(window.sessionStorage, 'clear');
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    component.logout();

    expect(window.sessionStorage.clear).toHaveBeenCalled();
    expect(window.location.href).toContain('eu-central-1wuzi3cd3n.auth.eu-central-1.amazoncognito.com/logout');
  });

  it('should prepare route for animations', () => {
    const mockOutlet = {
      activatedRouteData: { animation: 'test' }
    } as any;

    const result = component.prepareRoute(mockOutlet);
    expect(result).toBe('test');
  });
});
