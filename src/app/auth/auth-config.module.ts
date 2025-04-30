import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
              authority: 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_wUzI3Cd3n',
              redirectUrl: 'http://localhost:4200',
              postLogoutRedirectUri: 'http://localhost:4200',
              clientId: '4rfqprqpe0jcvofcmogv3if547',
              scope: 'email openid phone', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
