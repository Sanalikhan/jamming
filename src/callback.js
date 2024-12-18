import React,{useEffect} from 'react';
import { getAuthorizationCode,exchangeCodeForToken, storeTokens } from './pkceutilities';


const Callback= ()=>{
    useEffect(()=>{
      console.log("Starting Token Exchange");
        const authCode= getAuthorizationCode();
        console.log('AuthorizationCode:', authCode);

        //Exchange the authorization code for tokens
        if(authCode){
          console.log("Starting token exchange...");
            exchangeCodeForToken(authCode)
              .then((tokens)=>{
                console.log("Received Tokens:", tokens);
                storeTokens(tokens);
                console.log('Token exchanged and stored successfully!');
              })
              .catch((err)=>{
                console.error('Error during token exchange:', err);
              });
            }
            else{
              console.warn('No Authorization Code found in URL!');
            }
        },[]);

    return <div>Processing Spotify Authentication...</div>
};

export default Callback;
/*
http://localhost:3000/callback?code=AQCTYIh6gOuFAA4AxkynbfP0GwkIH0a9h-hHgEXE-zc1c9j75LrRDzS8_VKHA9g9_WKmWta5HuiV_KaCiBSV-Gmu1_nSxFPrZ0PJoeBOIp8IBUhnTTrFOGFnBXJGBJw_MLUgXrxF1OsfbjORnPivQmGAXMuVL-5gmGWPFXqHQNTJvcjria6SxS7ZyA20m5H_SIGgV7B35gbif4-H9RT8tuvMqk8WX9dVYGLjcNOk_lXj3L0CRbipxeN3Ugzr-oDsCPpt3nCCm0LPRE2BNjwIikEamg2zrgzaPg
*/