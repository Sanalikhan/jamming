
//code verifier
export const generateCodeVerifier=(length)=>{
const possible='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const values=crypto.getRandomValues(new Uint8Array(length));
return values.reduce((acc,value)=>acc+possible[value%possible.length], "");
}
 //code challenge i.e. making a hash using SHA algorithm & generate base64 representation of the digest we just calculated above with sha-function
 export const generateCodeChallenge= async (Verifier)=>{
    const encoder = new TextEncoder();
    const data = encoder.encode(Verifier);
    const hashedData= await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashedData)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
 };


 //redirect to spotify
export async function redirectToSpotifyAuth(){
   const clientId='b09cf7cd755743e68f961a9124779aa1';
   const redirectUri='http://localhost:3000/callback';
   const scope='user-read-private user-read-email';
   const codeVerifier=generateCodeVerifier(64);
   const codeChallenge=await generateCodeChallenge(codeVerifier);

   //store code verifier in local storage for later use
   window.localStorage.setItem('code_verifier', codeVerifier);

   //making uth. Url
   const authUrl= new URL('https://accounts.spotify.com/authorize');
   const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
   };
   authUrl.search= new URLSearchParams(params).toString();
   window.location.href=authUrl.toString();
}

//getAuthorizationCode
export function getAuthorizationCode(){
   const urlParams = new URLSearchParams(window.location.search); //parse query string
   const authorizationCode= urlParams.get('code'); //extract the "code" parameter
   return authorizationCode;
}

//exchangeCodeForTokens
export async function exchangeCodeForToken(authorizationCode){
   const clientId='b09cf7cd755743e68f961a9124779aa1';
   const redirectUri='http://localhost:3000/callback';
   const codeVerifier=localStorage.getItem('code_verifier');
   
   const url='https://accounts.spotify.com/api/token';

   const body= new URLSearchParams();
   body.append('client_id',clientId);
   body.append('redirect_uri',redirectUri);
   body.append('grant_type','authorization_code');
   body.append('code',authorizationCode);
   body.append('code_verifier',codeVerifier);

   try{
      console.log('Sending Token Request to Spotify...');
      const response= await fetch(url,{
         method: 'POST',
         headers:{
            'Content-type': 'application/x-www-form-urlencoded',
         },
         body: body.toString(),
      });

      console.log('Token Response Status:', response.status);

      if (!response.ok){
         throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const data= await response.json();
      console.log('Token Response Data:', data);
      return data;
   }

   catch(error){
      console.error('Error exchanging code for tokens',error);
      throw error;
   }
}

//save tokens
export function storeTokens(tokens){
   window.localStorage.setItem('access_token', tokens.access_token);
   window.localStorage.setItem('refresh_token', tokens.refresh_token);
   window.localStorage.setItem('expires_in', tokens.expires_in);
   console.log('Token stored successfully!');
}




