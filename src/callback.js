import {useEffect} from 'react';
import { getAuthorizationCode,exchangeCodeForToken, storeTokens } from './pkceutilities';
import {useNavigate } from 'react-router-dom';


const Callback= ()=>{
  const navigate= useNavigate();
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
                navigate('/');
                console.log('Token exchanged and stored successfully!');
              })
              .catch((err)=>{
                console.error('Error during token exchange:', err);
              });
            }
            else{
              console.warn('No Authorization Code found in URL!');
              navigate('/'); //redirect to Home even if no authorization code
            }
        },[navigate]);
};

export default Callback;
