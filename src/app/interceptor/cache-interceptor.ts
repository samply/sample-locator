import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ExternalUrlService} from '../service/external-url.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private externalUrlService: ExternalUrlService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({headers: req.headers
        .set('Expires', '-1')
        .set('Pragma', 'no-cache')
        .set('Cache-Control', 'no-cache')
    });
    if (req.url.startsWith(this.externalUrlService.getBrokerUrl())) {
      return next.handle(modifiedReq);
    } else {
      return next.handle(req);
    }
  }
}
