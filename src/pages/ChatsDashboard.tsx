import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Search,
  Filter,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Zap,
  Send,
  CheckCheck,
  MessageSquare,
  User,
  PlayCircle,
  PauseCircle
} from 'lucide-react'
import { useConversations, Conversation } from '@/hooks/useConversations'
import { useChatMessages } from '@/hooks/useChatMessages'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import PauseDurationDialog from '@/components/PauseDurationDialog'
import { getAllEndpoints } from '@/constants/apiEndpoints'

export default function ChatsDashboard() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false)
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Usar hooks customizados
  const {
    conversations,
    setConversations,
    loading,
    updateConversationLastMessage,
    fetchConversations
  } = useConversations()

  const { messages, handleNewMessage } = useChatMessages(selectedChat)

  // Configurar atualizações em tempo real
  useRealtimeUpdates({ updateConversationLastMessage, fetchConversations })

  // Scroll automático para última mensagem
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages, selectedChat])

  // Encontrar a conversa selecionada
  const selectedConversation = conversations.find(conv => conv.id === selectedChat)

  // Marcar conversa como lida quando selecionada
  const markConversationRead = (sessionId: string) => {
    setConversations(currentConversations =>
      currentConversations.map(conv => {
        if (conv.id === sessionId) {
          return { ...conv, unread: 0 }
        }
        return conv
      })
    )
  }

  // Abrir diálogo de pausa
  const openPauseDialog = (phoneNumber: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedPhoneNumber(phoneNumber)
    setPauseDialogOpen(true)
  }

  // Fechar diálogo de pausa
  const closePauseDialog = () => {
    setPauseDialogOpen(false)
  }

  // Pausar bot
  const pauseBot = async (duration: number | null) => {
    try {
      setIsLoading(prev => ({ ...prev, [`pause-${selectedPhoneNumber}`]: true }))

      const endpoints = getAllEndpoints()
      const response = await fetch(endpoints.pausaBot, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: selectedPhoneNumber,
          duration,
          unit: 'seconds'
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao pausar o bot')
      }

      toast({
        title: 'Bot pausado',
        description: duration
          ? `Bot pausado com sucesso para ${selectedPhoneNumber} por ${duration} segundos`
          : `Bot não foi pausado para ${selectedPhoneNumber}`,
      })
    } catch (error) {
      console.error('Erro ao pausar bot:', error)
      toast({
        title: 'Erro ao pausar bot',
        description: 'Ocorreu um erro ao pausar o bot.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(prev => ({ ...prev, [`pause-${selectedPhoneNumber}`]: false }))
      closePauseDialog()
    }
  }

  // Iniciar bot
  const startBot = async (phoneNumber: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      setIsLoading(prev => ({ ...prev, [`start-${phoneNumber}`]: true }))

      const endpoints = getAllEndpoints()
      const response = await fetch(endpoints.iniciaBot, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Erro ao iniciar o bot')
      }

      toast({
        title: 'Bot ativado',
        description: `Bot ativado com sucesso para ${phoneNumber}`
      })
    } catch (error) {
      console.error('Erro ao iniciar bot:', error)
      toast({
        title: 'Erro ao ativar bot',
        description: 'Ocorreu um erro ao ativar o bot.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(prev => ({ ...prev, [`start-${phoneNumber}`]: false }))
    }
  }

  // Enviar mensagem
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: Date.now(),
      session_id: selectedConversation.id,
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      message: {
        type: 'human' as const,
        content: newMessage
      },
      data: new Date().toISOString(),
      instancia: 'web'
    }

    handleNewMessage(message)
    updateConversationLastMessage(selectedConversation.id)
    setNewMessage('')

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Formatar tempo
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `${diffInMinutes} min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  // Obter iniciais
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Filtrar conversas
  const filteredConversations = conversations.filter(conversation =>
    !searchTerm ||
    conversation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.phone?.includes(searchTerm) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-screen bg-slate-900 flex relative">
      {/* Coluna Esquerda - Caixa de Entrada */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 shadow-lg flex flex-col">
        <div className="p-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-lg font-semibold mb-4 text-white">Caixa de entrada</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar pessoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
            />
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa encontrada</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                    selectedChat === conversation.id
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedChat(conversation.id)
                    markConversationRead(conversation.id)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                          {getInitials(conversation.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate text-white">
                          {conversation.name || 'Usuário'}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {conversation.lastActivity
                            ? formatTimeAgo(conversation.lastActivity)
                            : conversation.time}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 truncate mb-1">
                        {conversation.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-200">
                            {conversation.lead?.source || 'WhatsApp'}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {conversation.messageCount || 0} mensagens
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Coluna Central - Chat */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {selectedConversation ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shadow-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-white/30">
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {getInitials(selectedConversation.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{selectedConversation.name || 'Usuário'}</h3>
                  <p className="text-sm text-green-100">
                    {selectedConversation.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => openPauseDialog(selectedConversation.phone, e)}
                  className="text-white hover:text-white hover:bg-white/20"
                  disabled={isLoading[`pause-${selectedConversation.phone}`]}
                >
                  <PauseCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => startBot(selectedConversation.phone, e)}
                  className="text-white hover:text-white hover:bg-white/20"
                  disabled={isLoading[`start-${selectedConversation.phone}`]}
                >
                  <PlayCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4 bg-slate-950">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Nenhuma mensagem para exibir</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id || message.timestamp}
                        className={`flex ${
                          message.message?.type === 'human' || message.role === 'user'
                            ? 'justify-start'
                            : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 shadow-md ${
                            message.message?.type === 'human' || message.role === 'user'
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-800 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.message?.type === 'human' || message.role === 'user'
                                ? selectedConversation.name
                                : 'Dani'}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(message.data || message.timestamp).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {(message.message?.type === 'ai' || message.role === 'assistant') && (
                              <CheckCheck className="w-3 h-3" />
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {message.message?.content || message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 shadow-lg">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Zap className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-slate-600 focus:ring-2 focus:ring-slate-700"
                />
                <Button onClick={sendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-950">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Coluna Direita - Insights */}
      <div className="w-80 bg-slate-800 border-l border-slate-700 shadow-lg flex flex-col">
        <div className="p-4 border-b border-slate-700 bg-slate-900">
          <h2 className="text-lg font-semibold text-white">Insights</h2>
        </div>

        {selectedConversation ? (
          <ScrollArea className="flex-1 p-4 bg-slate-800">
            <div className="space-y-6">
              {/* Perfil do Lead */}
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-slate-600">
                  <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                    {getInitials(selectedConversation.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-white">{selectedConversation.name || 'Usuário'}</h3>
                <p className="text-sm text-slate-400">{selectedConversation.phone}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {selectedConversation.lead?.source || 'WhatsApp'}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Ações Rápidas */}
              <div>
                <h4 className="font-medium mb-3 text-white">Ações rápidas</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-red-600 hover:bg-red-700 text-white border-0"
                    onClick={(e) => openPauseDialog(selectedConversation.phone, e)}
                  >
                    Pausar Bot
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white border-0"
                    onClick={(e) => startBot(selectedConversation.phone, e)}
                  >
                    Ativar Bot
                  </Button>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              {/* Informações do Lead */}
              <div>
                <h4 className="font-medium mb-3 text-white">Informações</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{selectedConversation.email || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estágio:</span>
                    <Badge className="bg-yellow-600/20 text-yellow-400">
                      {selectedConversation.lead?.stage || 'Qualificação'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-white">{selectedConversation.status || 'Ativo'}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-800">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-500" />
              <p>Selecione uma conversa para ver os insights</p>
            </div>
          </div>
        )}
      </div>

      {/* Diálogo de Pausa */}
      <PauseDurationDialog
        isOpen={pauseDialogOpen}
        onClose={closePauseDialog}
        onConfirm={pauseBot}
        phoneNumber={selectedPhoneNumber}
      />
    </div>
  )
}
