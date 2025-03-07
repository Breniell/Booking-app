// src/components/SocialLogin.tsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
// Vous pouvez installer et utiliser react-facebook-login pour Facebook, par exemple :
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// Pour Apple, des solutions comme react-apple-login existent.

const SocialLogin: React.FC = () => {
  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log('Google login success:', credentialResponse);
    // Envoyer credentialResponse.credential au backend pour authentification
    // Par exemple, postez vers /users/google-login avec le token
  };

  const handleGoogleFailure = (error: any) => {
    console.error('Google login error:', error);
  };

  const handleFacebookLogin = () => {
    // Ici, implémentez votre logique Facebook (via Facebook SDK ou react-facebook-login)
    console.log('Facebook login clicked');
  };

  const handleAppleLogin = () => {
    // Implémentez la logique pour Apple login (via react-apple-login ou directement via le SDK)
    console.log('Apple login clicked');
  };

  return (
    <div className="flex flex-col gap-6">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
      />
      <button
        onClick={handleFacebookLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:shadow-xl transition-colors text-xl"
      >
        Se connecter avec Facebook
      </button>
      <button
        onClick={handleAppleLogin}
        className="bg-black text-white px-6 py-3 rounded-xl shadow hover:shadow-xl transition-colors text-xl"
      >
        Se connecter avec Apple
      </button>
    </div>
  );
};

export default SocialLogin;
