import { Contact } from '@/types/client'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  User,
  CreditCard
} from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ClientCardProps {
  client: Contact
  onEdit: (client: Contact) => void
  onDelete: (client: Contact) => void
  onView: (client: Contact) => void
  onMessage: (client: Contact) => void
}

export function ClientCard({
  client,
  onEdit,
  onDelete,
  onView,
  onMessage
}: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-600/30'
      case 'inactive':
        return 'bg-red-600/20 text-red-400 border-red-600/30'
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-600/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Ativo'
      case 'inactive':
        return 'Inativo'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-slate-600">
      <div className="flex items-start justify-between mb-4">
        {/* Client Info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white truncate">
                {client.name}
              </h3>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(client.status)}`}>
                {getStatusLabel(client.status)}
              </span>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {client.email && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm truncate">{client.email}</span>
                </div>
              )}

              {client.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm">{client.phone}</span>
                </div>
              )}

              {client.cpfCnpj && (
                <div className="flex items-center gap-2 text-slate-300">
                  <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm">{client.cpfCnpj}</span>
                </div>
              )}

              {client.address && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm truncate">{client.address}</span>
                </div>
              )}
            </div>

            {/* Last Contact */}
            {client.lastContact && (
              <div className="flex items-center gap-2 text-slate-400 mt-3">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">
                  Último contato: {formatDate(client.lastContact)}
                </span>
              </div>
            )}

            {/* Notes Preview */}
            {client.notes && (
              <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-300 line-clamp-2">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          <Button
            onClick={() => onView(client)}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onMessage(client)}
            variant="outline"
            size="sm"
            className="bg-blue-600/10 border-blue-600/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-600/50"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onEdit(client)}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(client)}
            variant="outline"
            size="sm"
            className="bg-red-600/10 border-red-600/30 text-red-400 hover:bg-red-600/20 hover:border-red-600/50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
