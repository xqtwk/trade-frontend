import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideNgxStripe} from "ngx-stripe";
import {loggerInterceptor} from "./interceptors/logger.interceptor";
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
        loggerInterceptor
    ])),
    provideAnimations()
]
};
