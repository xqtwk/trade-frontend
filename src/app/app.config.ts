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
    provideNgxStripe('pk_test_51OIFQQBurQqw5g3lwqIQDciVWyTEhWIWlaYAyyaJdgiBHVY5BHduSL53ygobg41OZlX0vsvQXOgWQPs56b3Bkqle00UfVdt3wR'),
    provideAnimations()
]
};
