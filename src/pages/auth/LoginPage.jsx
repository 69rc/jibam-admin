import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff, MdLock, MdEmail } from 'react-icons/md';
import { authAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import JibamLogo from '../../components/common/JibamLogo';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      const { user, accessToken, refreshToken } = res.data.data;
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin accounts only.');
        return;
      }
      setAuth({ user, accessToken, refreshToken });
      toast.success(`Welcome back, ${user.fullname.split(' ')[0]}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F4F6FB' }}>
      {/* ── Left panel (navy) ─────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: '#0D1B5E' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: '#00AEEF' }} />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-15"
          style={{ backgroundColor: '#1A2E8A' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: '#00AEEF' }} />

        {/* Logo + copy */}
        <div className="relative z-10 text-center space-y-8">
          <JibamLogo size="xl" light />
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white leading-snug">
              Admin Dashboard
            </h2>
            <p className="text-blue-200 text-base max-w-xs mx-auto leading-relaxed">
              Manage your pharmacy operations, inventory, orders and customers from one place.
            </p>
          </div>

          {/* Feature pills */}
          {['📦 Product Management', '🛒 Order Tracking', '📊 Sales Analytics', '👥 Customer Management'].map((f) => (
            <div
              key={f}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-blue-100 mr-2 mb-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (white form) ───────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <JibamLogo size="lg" />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border" style={{ borderColor: '#EDF0F8' }}>
            <div className="mb-7">
              <h1 className="text-2xl font-bold" style={{ color: '#0D1B5E' }}>Sign In</h1>
              <p className="text-slate-500 text-sm mt-1">Enter your admin credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <MdEmail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"
                    style={{ color: '#00AEEF' }}
                  />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                    })}
                    type="email"
                    placeholder="admin@jibampharmacy.com"
                    className="input pl-10"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <MdLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xl"
                    style={{ color: '#00AEEF' }}
                  />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass
                      ? <MdVisibilityOff className="text-xl" />
                      : <MdVisibility className="text-xl" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-400 text-xs mt-5">
            © {new Date().getFullYear()} Jibam Pharmacy · RC: 1948976
          </p>
        </div>
      </div>
    </div>
  );
}
