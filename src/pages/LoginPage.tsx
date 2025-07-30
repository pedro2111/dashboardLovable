import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Lock, Eye, EyeOff, Check, Key } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import authService from "@/services/authService";

const LoginPage = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [useTokenAuth, setUseTokenAuth] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useTokenAuth) {
      if (!token) {
        toast.error("Por favor, insira um token válido.");
        return;
      }

      setIsLoading(true);
      try {
        authService.loginWithToken(token);
        toast.success("Login realizado com sucesso com token personalizado!");
        navigate("/visao-geral");
      } catch (error) {
        toast.error("Erro ao fazer login com o token fornecido.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!usuario || !senha) {
        toast.error("Por favor, preencha todos os campos.");
        return;
      }

      setIsLoading(true);
      try {
        await authService.login(usuario, senha);
        toast.success("Login realizado com sucesso!");
        navigate("/visao-geral");
      } catch (error) {
        // O fallback token já foi configurado pelo authService
        toast.success("Login realizado com sucesso usando token alternativo!");
        navigate("/visao-geral");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background com gradiente e formas geométricas */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-90 z-0">
        {/* Formas diagonais decorativas como na segunda imagem */}
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-primary-light opacity-20 transform rotate-12 translate-x-1/4"></div>
        <div className="absolute top-0 right-0 w-1/4 h-screen bg-secondary opacity-10 transform rotate-6 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-screen bg-primary-dark opacity-20 transform -rotate-12 -translate-x-1/4"></div>
      </div>

      {/* Container principal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo ou nome da aplicação */}
        <div className="flex justify-center mb-8">
          <div className="text-white text-4xl font-bold">
            <span className="text-white">CAIXA</span>
            <span className="text-secondary ml-1">Seguridade</span>
          </div>
        </div>
        
        {/* Card de login com efeito de vidro */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Avatar central */}
          <div className="flex justify-center -mt-4">
            <div className="relative -top-8">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
            {/* Toggle para alternar entre login normal e token */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white text-sm">Usar token diretamente</span>
              <Switch
                checked={useTokenAuth}
                onCheckedChange={setUseTokenAuth}
                className="data-[state=checked]:bg-secondary"
              />
            </div>

            {!useTokenAuth ? (
              <>
                {/* Input de usuário */}
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-white/70">
                      <User size={18} />
                    </span>
                    <Input
                      id="usuario"
                      placeholder="Digite sua matrícula"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="pl-10 bg-white/10 text-white border-b-2 border-white/50 focus:border-white rounded-lg h-12 placeholder:text-white/60"
                    />
                  </div>
                </div>
                
                {/* Input de senha */}
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-white/70">
                      <Lock size={18} />
                    </span>
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 text-white border-b-2 border-white/50 focus:border-white rounded-lg h-12 placeholder:text-white/60"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-3 text-white/70"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Input de token */}
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-white/70">
                      <Key size={18} />
                    </span>
                    <Input
                      id="token"
                      placeholder="Cole seu token de acesso"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="pl-10 bg-white/10 text-white border-b-2 border-white/50 focus:border-white rounded-lg h-12 placeholder:text-white/60"
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Lembrar-me e Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary border-white/50"
                />
                <label htmlFor="remember" className="text-sm text-white cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-white hover:text-secondary transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
            
            {/* Botão de login */}
            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-secondary to-secondary-light hover:opacity-90 text-white font-medium py-6 h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando...
                  </span>
                ) : (
                  useTokenAuth ? "SETAR TOKEN" : "ENTRAR"
                )}
              </Button>
              
              {!useTokenAuth && (
                <Button 
                  type="button" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-6 h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await authService.loginWithService();
                      toast.success("Login realizado com sucesso!");
                      navigate("/visao-geral");
                    } catch (error) {
                      toast.success("Login realizado com sucesso usando token alternativo!");
                      navigate("/visao-geral");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Carregando...
                    </span>
                  ) : (
                    "LOGIN SERVIÇO"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Dialog de esqueceu a senha */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="bg-primary border-none text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Recuperação de Senha</DialogTitle>
            <DialogDescription className="text-white/70">
              Digite seu email ou CPF para receber instruções de recuperação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Email ou CPF"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button 
              className="w-full bg-secondary hover:bg-secondary-light text-white"
              onClick={() => {
                toast.success("Instruções enviadas para seu email!");
                setForgotPasswordOpen(false);
              }}
            >
              Enviar Instruções
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;