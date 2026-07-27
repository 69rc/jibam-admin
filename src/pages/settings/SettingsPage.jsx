import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { MdPerson, MdLock, MdInfo } from 'react-icons/md';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import JibamLogo from '../../components/common/JibamLogo';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: pErrors },
  } = useForm({ defaultValues: { fullname: user?.fullname, phone: user?.phone } });

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm();

  const profileMutation = useMutation({
    mutationFn: (data) => api.put('/auth/profile', data),
    onSuccess: (res) => {
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => api.put('/auth/change-password', data),
    onSuccess: () => {
      toast.success('Password changed successfully');
      resetPw();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Profile card ──────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl" style={{ backgroundColor: '#E8ECF8' }}>
            <MdPerson className="text-xl" style={{ color: '#0D1B5E' }} />
          </div>
          <div>
            <h2 className="font-bold" style={{ color: '#0D1B5E' }}>Profile Settings</h2>
            <p className="text-xs text-slate-400">Update your account details</p>
          </div>
        </div>

        <form onSubmit={handleProfile(profileMutation.mutate)} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              {...regProfile('fullname', { required: 'Name is required' })}
              className="input"
              placeholder="Your full name"
            />
            {pErrors.fullname && (
              <p className="text-red-500 text-xs mt-1">{pErrors.fullname.message}</p>
            )}
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              value={user?.email || ''}
              disabled
              className="input bg-slate-50 cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              {...regProfile('phone')}
              className="input"
              placeholder="08012345678"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="btn-primary px-8"
            >
              {profileMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Change Password card ───────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl" style={{ backgroundColor: '#E0F5FD' }}>
            <MdLock className="text-xl" style={{ color: '#00AEEF' }} />
          </div>
          <div>
            <h2 className="font-bold" style={{ color: '#0D1B5E' }}>Change Password</h2>
            <p className="text-xs text-slate-400">Keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePw(passwordMutation.mutate)} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              {...regPw('currentPassword', { required: 'Current password is required' })}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {pwErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{pwErrors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="label">New Password</label>
            <input
              {...regPw('newPassword', {
                required: 'New password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {pwErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{pwErrors.newPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="btn-accent px-8"
            >
              {passwordMutation.isPending ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* ── About card ────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 flex items-center gap-5"
        style={{ backgroundColor: '#0D1B5E' }}
      >
        <JibamLogo size="md" light variant="icon" />
        <div>
          <div className="flex items-center gap-3 mb-1">
            <JibamLogo size="sm" light variant="text" />
          </div>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Admin Dashboard · Version 1.0.0 · RC: 1948976
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Built for better healthcare access across Nigeria
          </p>
        </div>
      </div>
    </div>
  );
}
