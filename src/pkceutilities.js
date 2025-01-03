
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
   const scopes=[
   'user-read-private',
   'user-read-email',
   'playlist-modify-private',
   'playlist-modify-public',
   'playlist-read-collaborative',
   'playlist-read-private'
   ];
   const codeVerifier=generateCodeVerifier(64);
   const codeChallenge=await generateCodeChallenge(codeVerifier);

   //store code verifier in local storage for later use
   window.localStorage.setItem('code_verifier', codeVerifier);
   window.localStorage.setItem('code_challenge',codeChallenge);

   //making uth. Url
   const authUrl= new URL('https://accounts.spotify.com/authorize');
   const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scopes.join(' '), //scopes should be space-separated string   
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
      console.log("Request body:", body.toString());
      console.log("Fetch response:", response);
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
   const expirationTime = Date.now() + tokens.expires_in * 1000;//calculate expiration time
   window.localStorage.setItem('access_token', tokens.access_token);
   window.localStorage.setItem('refresh_token', tokens.refresh_token);
   window.localStorage.setItem('expires_in', tokens.expires_in);
   window.localStorage.setItem('expires_at', expirationTime);
   console.log('Token stored successfully!');
}

//code to refresh the tokens
export async function refreshToken(){
   const refreshToken=localStorage.getItem('refresh_token');
   if (!refreshToken){
      console.error(`No refresh token found!`);
      return null;
   }
   const clientId= 'b09cf7cd755743e68f961a9124779aa1';
   const url='https://accounts.spotify.com/api/token';
   const body=new URLSearchParams();
   body.append('client_id',clientId);
   body.append('refresh_token', refreshToken);
   body.append('grant_type','refresh_token');

   try{
      console.log('Requesting new access token using refresh token...');
      const response= await fetch(url,
         {
            method:'POST',
            headers:{
               'Content-type': 'application/x-www-form-urlencoded'
            },
            body: body.toString(),
         }
      );
      console.log("Request body:", body.toString());
      console.log("Fetch response:", response);
       if (!response.ok){
         const errorBody= await response.text();
         throw new Error(`Token refresh failed: ${response.statusText} (${response.status}) - ${errorBody})`);
       }
       const data= await response.json();
       console.log('Token refresh response data', data);

       //update localStorage with new access token and expiry time
       if (data.access_token){
         localStorage.setItem('access_token', data.access_token);
         if (data.expires_in){
            localStorage.setItem('expires_in',data.expires_in);
         }
       }
       return data.access_token;
   }
   catch(error){
      console.log('Error refreshing access token',error);
      throw error;
   }
} 

//get valid access Token
export async function getValidAccessToken(){
   const accessToken= localStorage.getItem('access_token');
   const expiresAt= parseInt(localStorage.getItem("expires_at"),10); //retrieves the stored expiration time

    if(accessToken && Date.now() < expiresAt){
      console.log('Access token is still valid');
      return accessToken;
    }
    //refreshing the token
    try{
      console.log('Access token has expired. Refreshing...');
      return await refreshToken();
    }catch(error){
      console.error('Error refreshing the token:', error );
      //Handle token refresh failure
      alert ('Session expired. Please login again.');
      localStorage.clear();//clear the stored tokens 
      redirectToSpotifyAuth(); //Re-initiate authentication flow
    }
}


export async function UserId(){
   try{
      const accessToken= await getValidAccessToken();
      if(!accessToken){
         console.error(`Access Token is undefined or invalid.`);
         throw new Error('Failed to obtain access token.');
      }
      const userid_response= await fetch('/spotify-api/v1/me', {
         method: 'GET',
         headers:{
             Authorization:`Bearer ${accessToken}`,
         }
     });
     if(!userid_response.ok){
         console.error(`Request for accessing Spotify User ID failed:${userid_response.status}`);
         throw new Error('Failed to fetch user ID');
     } 
     const userData = await userid_response.json();
     const user_id= userData.id;
     return user_id;
   }
   catch (error) {
      console.log('Error in UserId function:', error.message);
      throw error;
   }
}



