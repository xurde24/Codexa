import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser, setGuestMode } from '../authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({ // so these 3 fields are a=mandatory and little bit of validation
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth); 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const passwordValue = watch('password', '');

  // Calculate password strength
  const calculateStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // Max 5
  };

  const strengthScore = calculateStrength(passwordValue);

  const getStrengthColor = (score) => {
    if (score <= 2) return 'bg-error';
    if (score === 3 || score === 4) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthLabel = (score) => {
    if (!passwordValue) return '';
    if (score <= 2) return 'Weak';
    if (score === 3 || score === 4) return 'Fair';
    if (score === 5) return 'Strong';
    return '';
  };

  const getLabelColor = (score) => {
    if (score <= 2) return 'text-error';
    if (score === 3 || score === 4) return 'text-warning';
    return 'text-success';
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Account created successfully! Welcome to CodeForge.');
    } catch (err) {
      toast.error(err || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--color-brand-dark)] flex relative"> 

      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-start p-12 xl:p-20 relative z-10 border-r border-[var(--color-brand-border)]">

        <div className="max-w-xl border-l-4 border-l-[var(--color-brand-orange)] pl-8 relative z-20">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-[var(--color-brand-text-primary)] mb-6 tracking-tight leading-tight font-outfit">
            CodeForge.<br/>
            <span className="text-[var(--color-brand-orange)]">Ace Interviews.</span>
          </h1>
          <p className="text-[var(--color-brand-text-secondary)] text-lg mb-10 leading-relaxed font-medium">
            Join the ultimate platform to level up your coding skills, solve complex challenges, and build a standout portfolio.
          </p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)]">✓</div>
              <span className="text-[var(--color-brand-text-primary)] font-semibold text-lg">Real-time code execution</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)]">✓</div>
              <span className="text-[var(--color-brand-text-primary)] font-semibold text-lg">Premium UI & Experience</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)]">✓</div>
              <span className="text-[var(--color-brand-text-primary)] font-semibold text-lg">Interview-ready questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-16 z-10">
        <div className="card w-full max-w-[480px] glass-card text-[var(--color-brand-text-primary)]">
          <div className="card-body p-8 sm:p-10">
            <h2 className="card-title justify-center text-3xl font-extrabold mb-8 tracking-tight font-outfit">
              <span className="text-[var(--color-brand-text-primary)]">Signup</span>
            </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[var(--color-brand-text-secondary)] font-medium">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Ram"
                className={`input input-bordered neo-input w-full ${errors.firstName ? 'input-error' : ''}`} 
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error text-xs font-medium mt-1.5">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-[var(--color-brand-text-secondary)] font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="ram@iiitbh.com"
                className={`input input-bordered neo-input w-full ${errors.emailId ? 'input-error' : ''}`} 
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-xs font-medium mt-1.5">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-[var(--color-brand-text-secondary)] font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered neo-input w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-orange)] transition-all p-1" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} 
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-xs font-medium mt-1.5">{errors.password.message}</span>
              )}
              
              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1.5 px-0.5">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Password Strength</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${getLabelColor(strengthScore)}`}>
                      {getStrengthLabel(strengthScore)}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-full w-full rounded-full transition-all duration-300 ${
                          strengthScore >= level ? getStrengthColor(strengthScore) : 'bg-gray-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                  {strengthScore < 5 && (
                     <p className="text-[11px] leading-tight text-gray-400 mt-2">
                       Tip: Use 8+ characters, combining <span className={/[A-Z]/.test(passwordValue) ? "text-success font-semibold" : ""}>uppercase</span>, <span className={/[a-z]/.test(passwordValue) ? "text-success font-semibold" : ""}>lowercase</span>, <span className={/\d/.test(passwordValue) ? "text-success font-semibold" : ""}>numbers</span>, and <span className={/[^A-Za-z0-9]/.test(passwordValue) ? "text-success font-semibold" : ""}>symbols</span>.
                     </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8"> 
              <button
                type="submit"
                className={`btn neo-btn w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Create Account'}
              </button>
            </div>


          </form>

          <div className="text-center mt-6"> 
            <span className="text-sm text-[var(--color-brand-text-secondary)] font-medium">
              Already have an account?{' '}
              <NavLink to="/login" className="link font-bold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-hover)] transition-colors no-underline">
                Log in
              </NavLink>
            </span>
          </div>
        </div>
      </div>

        <div className="mt-4 flex justify-center w-full max-w-[480px]">
          <button
            type="button"
            className="btn px-10 bg-gray-200 text-gray-800 hover:bg-white hover:text-gray-900 border-none font-bold transition-all duration-300 rounded-lg py-2 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)]"
            onClick={() => {
              dispatch(setGuestMode());
              navigate('/');
            }}
          >
            Continue as Guest
          </button>
        </div>
    </div>

    {/* Footer */}
    <footer className="absolute bottom-4 left-0 right-0 text-center text-[11px] text-[var(--color-brand-text-secondary)] font-medium tracking-wider select-none pointer-events-none z-20">
      © {new Date().getFullYear()} CodeForge. All rights reserved. • Made with <span className="text-[var(--color-brand-orange)] inline-block">♥</span> by <a href="https://github.com/manishcodess" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brand-text-primary)] transition-colors pointer-events-auto underline decoration-[var(--color-brand-text-secondary)] hover:decoration-[var(--color-brand-orange)] underline-offset-2">Manish Kr. Sharma</a>
    </footer>
  </div>
  );
}

export default Signup;