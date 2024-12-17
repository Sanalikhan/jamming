import React from 'react';
import { getAuthorizationCode,exchangeCodeForToken, storeTokens } from './pkceutilities';


const Callback= ()=>{
    useEffect(()=>{
        const authCode= getAuthorizationCode();
        console.log('AuthorizationCode:', authCode);

        //Exchange the authorization code for tokens
        if(authCode){
            exchangeCodeForToken(authCode)
              .then((tokens)=>{
                storeTokens(tokens);
                console.log('Token exchanged and stored successfully!');
              })
              .catch((err)=>{
                console.error('Error during token exchange:', err);
              });
        }
    },[]);
    return <div>Processing Spotify Authentication...</div>
}

export default Callback;
/*
http://localhost:3000/callback?code=AQCTYIh6gOuFAA4AxkynbfP0GwkIH0a9h-hHgEXE-zc1c9j75LrRDzS8_VKHA9g9_WKmWta5HuiV_KaCiBSV-Gmu1_nSxFPrZ0PJoeBOIp8IBUhnTTrFOGFnBXJGBJw_MLUgXrxF1OsfbjORnPivQmGAXMuVL-5gmGWPFXqHQNTJvcjria6SxS7ZyA20m5H_SIGgV7B35gbif4-H9RT8tuvMqk8WX9dVYGLjcNOk_lXj3L0CRbipxeN3Ugzr-oDsCPpt3nCCm0LPRE2BNjwIikEamg2zrgzaPg
*/