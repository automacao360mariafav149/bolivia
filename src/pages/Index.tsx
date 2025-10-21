import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PasswordResetDialog } from '@/components/PasswordResetDialog';
import { DebugInfo } from '@/components/DebugInfo';

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
});

const Index = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Usuário logado, redirecionando para dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {
          email?: string;
          password?: string;
        } = {};
        
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Iniciando processo de login...');
      
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Erro de login:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Usuário não encontrado. Verifique o email digitado.';
        }
        
        toast.error(errorMessage);
      } else {
        console.log('Login realizado com sucesso');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro inesperado durante o login:', error);
      toast.error('Erro inesperado ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>
      
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/e29d8f0a-b4d1-4bcf-8dbc-fe28855a5379.png" 
          alt="Ferrari background" 
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
      </div>
      
      <div 
        className={`m-auto z-20 px-6 py-8 transition-all duration-700 transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="w-full max-w-md mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="glass-card dark:bg-gray-800/40 rounded-2xl p-8 space-y-6 animate-fade-in"
            style={{ backdropFilter: "blur(16px)" }}
          >
            <h1 className="text-2xl font-bold text-white text-center mb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Bem-vindo à Alvorada Veículos!
            </h1>
            <p className="text-white/80 text-center mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Entre para gerenciar sua concessionária
            </p>

            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-hover:text-petshop-gold transition-colors duration-300" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 h-12 bg-white/10 dark:bg-gray-700/50 border-white/20 text-white rounded-md transition-all duration-300 hover:border-petshop-gold/50 ${errors.email ? 'border-red-400' : 'focus:border-petshop-gold'}`}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-hover:text-petshop-gold transition-colors duration-300" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 h-12 bg-white/10 dark:bg-gray-700/50 border-white/20 text-white rounded-md transition-all duration-300 hover:border-petshop-gold/50 ${errors.password ? 'border-red-400' : 'focus:border-petshop-gold'}`}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 hover:text-petshop-gold transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 bg-white/10 dark:bg-gray-700/50 border-white/20 rounded focus:ring-petshop-gold text-petshop-gold"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-white/80 hover:text-white transition-colors duration-300">
                  Lembrar-me
                </label>
              </div>
              <PasswordResetDialog>
                <button 
                  type="button"
                  className="text-sm text-petshop-gold hover:text-white transition-colors duration-300"
                >
                  Esqueceu a senha?
                </button>
              </PasswordResetDialog>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full button-hover-effect bg-petshop-gold hover:bg-amber-500 text-petshop-blue dark:text-gray-900 font-bold py-3 px-4 rounded-md flex items-center justify-center transition-all duration-300 animate-slide-up"
              style={{ animationDelay: '0.6s' }}
            >
              {isLoading && (
                <div className="h-5 w-5 border-2 border-petshop-blue dark:border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
              )}
              {isLoading ? "Entrando..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      
      <DebugInfo />
    </div>
  );
};

export default Index;
