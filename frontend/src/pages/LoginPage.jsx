import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/auth'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err) {
      if (err.response?.status === 401) {
        setServerError('Invalid email or password')
      } else {
        setServerError('Something went wrong. Try again.')
      }
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      <section className="hidden lg:flex relative w-1/2 overflow-hidden bg-blue-600">
        <div className="absolute top-12 left-12 z-10">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>home_app_logo</span>
            <span className="text-lg font-bold">HomeManage</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <DotLottieReact
            src="https://lottie.host/18082f82-35e2-450c-872e-c25c06e3878e/1RTtJNMx0Z.lottie"
            loop
            autoplay
            className="w-3/4 h-auto"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-end p-20 w-full h-1/2 bg-linear-to-t from-blue-600/60 to-transparent">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl font-bold text-white">Bienvenido a HomeManage</h1>
            <p className="text-lg text-white/90 leading-relaxed">Gestiona tu hogar con calma y eficiencia.</p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-gray-50 p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <div className="lg:hidden flex items-center gap-2 text-blue-600 mb-6">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>home_app_logo</span>
              <span className="text-lg font-bold">HomeManage</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="text-sm text-gray-500">Ingresa tus credenciales para acceder a tu hogar digital.</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">
              {serverError}
            </div>
          )}

          <form className="space-y-4" id="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider" htmlFor="email">Correo Electrónico</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] transition-colors group-focus-within:text-blue-600">mail</span>
                <input
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                  id="email"
                  placeholder="ejemplo@correo.com"
                  type="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider" htmlFor="password">Contraseña</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] transition-colors group-focus-within:text-blue-600">lock</span>
                <input
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <a className="text-xs font-medium text-blue-600 hover:underline transition-all" href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <button
              className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:shadow-lg active:scale-[0.98] transition-all duration-200"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400">O</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 shadow-md" type="button">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continuar con Google
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              ¿No tienes una cuenta?
              <a className="text-blue-600 font-bold hover:underline ml-1" href="#">Crear una cuenta</a>
            </p>
          </div>
        </div>

        <footer className="absolute bottom-8 text-center px-4 w-full lg:w-1/2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} HomeManage. Todos los derechos reservados.
          </p>
        </footer>
      </section>
    </main>
  )
}
