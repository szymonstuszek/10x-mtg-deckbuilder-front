import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppModule } from './app.module';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { fader } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
  animations: [fader]
})
export class AppComponent implements OnInit {
  title = 'dev10x-mtg-deckbuilder';

  private readonly oidcSecurityService = inject(OidcSecurityService);

  configuration$ = this.oidcSecurityService.getConfiguration();
  userData$ = this.oidcSecurityService.userData$;

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe();
  }

  logout(): void {
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }

    // Redirect to Cognito logout endpoint
    const clientId = '4rfqprqpe0jcvofcmogv3if547';
    const logoutUri = environment.postLogoutRedirectUri;
    const cognitoDomain = 'https://eu-central-1wuzi3cd3n.auth.eu-central-1.amazoncognito.com';
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
