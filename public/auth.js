function ncmb_auth(provider) {
  return new Promise((res, rej) => {
    const auth = window.open(`${AUTH_URL}/auth/${provider}`, 'auth', 'width=500,height=500');
    window.addEventListener('message', message => {
      const data = message.data;
      if (data && data.user && data.sessionToken) {
        const user = JSON.parse(data.user);
        if (ncmb) {
          ncmb.sessionToken = user.sessionToken = data.sessionToken;
          localStorage.setItem(`NCMB/${ncmb.apikey}/currentUser`, JSON.stringify(user));
          res();
        } else {
          rej('NCMB Object is not found');
        }
      }
    }, false);
  });
}

