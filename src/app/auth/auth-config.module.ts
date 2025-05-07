import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
              authority: 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_wUzI3Cd3n',
              redirectUrl: environment.redirectUrl,
              postLogoutRedirectUri: environment.postLogoutRedirectUri,
              clientId: '4rfqprqpe0jcvofcmogv3if547',
              scope: 'email openid phone',
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
