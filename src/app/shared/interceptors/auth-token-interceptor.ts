import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
 
  // const masterApiKey = '697d4fbc53d66e53991956f6'; 
  const token = localStorage.getItem('token');
  


  let headersConfig: any = {
    // 'x-apikey': masterApiKey,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  };

  // if (token) {
  //   headersConfig['Authorization'] = `Bearer ${token}`;
  // }

  const clonedReq = req.clone({
    setHeaders: headersConfig
  });

 
  // console.log('Interceptor triggered for URL:', req.url);

  return next(clonedReq);
};