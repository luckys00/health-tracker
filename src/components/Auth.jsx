import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      let friendlyError = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Invalid email address.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-tr from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500">
      <div className="max-w-md w-full space-y-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-2xl shadow-indigo-100/40 dark:shadow-none transition-all duration-300">
        
        {/* Header */}
        <div className="text-center">
          <span className="p-3.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-3xl text-white shadow-xl shadow-indigo-200/50 dark:shadow-none inline-block mb-5 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2.5 text-sm font-medium text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Track heavy lifts & healthy meals with us.' : 'Sign in to access your fitness insights.'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="bg-rose-50/80 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300">
            {error}
          </div>
        )}

        {/* Form and Google Button Container */}
        <div className="space-y-6">
          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Email/Password Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          {isSignUp ? 'Already have an account? ' : 'New to HealthTracker? '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign up free'}
          </button>
        </div>

      </div>
    </div>
  );
}
