"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Plus,
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Globe,
  Upload,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ConexionesPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "",
    url: "",
    frequency: "daily",
  })

  const conexiones = [
    {
      id: 1,
      name: "Feed Principal XML",
      type: "XML",
      url: "https://turijobs.com/feed/ofertas.xml",
      frequency: "Cada hora",
      status: "active",
      lastSync: "2024-01-15T14:30:00",
      offersImported: 156,
      errors: 0,
    },
    {
      id: 2,
      name: "API Ofertas Premium",
      type: "API",
      url: "https://api.turijobs.com/v2/ofertas",
      frequency: "Cada 30 min",
      status: "active",
      lastSync: "2024-01-15T14:00:00",
      offersImported: 89,
      errors: 0,
    },
    {
      id: 3,
      name: "Importación Manual CSV",
      type: "Manual",
      url: "ofertas_enero_2024.csv",
      frequency: "Manual",
      status: "pending",
      lastSync: "2024-01-14T10:15:00",
      offersImported: 23,
      errors: 2,
    },
    {
      id: 4,
      name: "Feed Backup XML",
      type: "XML",
      url: "https://backup.turijobs.com/feed.xml",
      frequency: "Diario",
      status: "error",
      lastSync: "2024-01-13T08:00:00",
      offersImported: 0,
      errors: 5,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "XML":
        return <FileText className="h-4 w-4" />
      case "API":
        return <Globe className="h-4 w-4" />
      case "Manual":
        return <Upload className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSync = (connectionId: number) => {
    toast({
      title: "Sincronización iniciada",
      description: "La sincronización se ha iniciado correctamente",
    })
  }

  const handleCreateConnection = () => {
    if (!newConnection.name || !newConnection.type) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Conexión creada",
      description: `La conexión "${newConnection.name}" ha sido creada exitosamente`,
    })

    setNewConnection({ name: "", type: "", url: "", frequency: "daily" })
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Conexiones de Datos</h1>
            <p className="text-muted-foreground">Gestiona las fuentes de datos para importar ofertas</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Conexión
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Conexión de Datos</DialogTitle>
              <DialogDescription>Configura una nueva fuente de datos para importar ofertas</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la conexión *</Label>
                <Input
                  id="name"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Feed Principal XML"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de conexión *</Label>
                <Select
                  value={newConnection.type}
                  onValueChange={(value) => setNewConnection((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XML">XML Feed</SelectItem>
                    <SelectItem value="API">API REST</SelectItem>
                    <SelectItem value="Manual">Carga Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL o Archivo</Label>
                <Input
                  id="url"
                  value={newConnection.url}
                  onChange={(e) => setNewConnection((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://ejemplo.com/feed.xml"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia de actualización</Label>
                <Select
                  value={newConnection.frequency}
                  onValueChange={(value) => setNewConnection((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateConnection} className="flex-1">
                  Crear Conexión
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conexiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conexiones.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conexiones Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {conexiones.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Importadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conexiones.reduce((sum, c) => sum + c.offersImported, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errores Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{conexiones.reduce((sum, c) => sum + c.errors, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de conexiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Conexiones Configuradas
          </CardTitle>
          <CardDescription>Administra tus fuentes de datos y su estado de sincronización</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conexión</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Sincronización</TableHead>
                <TableHead>Ofertas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conexiones.map((conexion) => (
                <TableRow key={conexion.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{conexion.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{conexion.url}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(conexion.type)}
                      <span>{conexion.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{conexion.frequency}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(conexion.status)}
                      {getStatusBadge(conexion.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{formatDate(conexion.lastSync)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{conexion.offersImported} importadas</div>
                      {conexion.errors > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {conexion.errors} errores
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(conexion.id)}
                        disabled={conexion.status === "error"}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/conexiones/${conexion.id}/mapeo`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Conexión Soportados</CardTitle>
            <CardDescription>Modalidades disponibles para importar ofertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">XML Feed</h4>
                <p className="text-sm text-muted-foreground">
                  Importación automática desde URLs XML con estructura estándar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">API REST</h4>
                <p className="text-sm text-muted-foreground">
                  Conexión directa con APIs REST con autenticación configurable
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Upload className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Carga Manual</h4>
                <p className="text-sm text-muted-foreground">
                  Subida manual de archivos CSV o XML para importación puntual
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Sincronización</CardTitle>
            <CardDescription>Resumen del estado actual de las conexiones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Conexiones activas</span>
              </div>
              <span className="font-medium">{conexiones.filter((c) => c.status === "active").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Conexiones con error</span>
              </div>
              <span className="font-medium">{conexiones.filter((c) => c.status === "error").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Conexiones pendientes</span>
              </div>
              <span className="font-medium">{conexiones.filter((c) => c.status === "pending").length}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total ofertas importadas</span>
                <span className="font-bold">{conexiones.reduce((sum, c) => sum + c.offersImported, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
