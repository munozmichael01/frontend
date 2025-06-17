"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  ArrowLeft,
  Database,
  ArrowRight,
  Eye,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Zap,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function MapeoPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const connectionId = params.id

  // Datos simulados de la conexión
  const conexion = {
    id: connectionId,
    name: "Feed Principal XML",
    type: "XML",
    url: "https://turijobs.com/feed/ofertas.xml",
    status: "active",
  }

  // Campos detectados automáticamente en la fuente de datos
  const [sourceFields] = useState([
    {
      name: "job_title",
      type: "string",
      sample: "Desarrollador Frontend React",
      required: true,
      description: "Título del puesto de trabajo",
    },
    {
      name: "company_name",
      type: "string",
      sample: "TechCorp Solutions",
      required: true,
      description: "Nombre de la empresa",
    },
    {
      name: "job_description",
      type: "text",
      sample: "Buscamos desarrollador con experiencia en React...",
      required: false,
      description: "Descripción detallada del puesto",
    },
    {
      name: "location_city",
      type: "string",
      sample: "Madrid",
      required: true,
      description: "Ciudad donde se ubica el puesto",
    },
    {
      name: "salary_min",
      type: "number",
      sample: "35000",
      required: false,
      description: "Salario mínimo anual",
    },
    {
      name: "salary_max",
      type: "number",
      sample: "45000",
      required: false,
      description: "Salario máximo anual",
    },
    {
      name: "contract_type",
      type: "string",
      sample: "Indefinido",
      required: false,
      description: "Tipo de contrato",
    },
    {
      name: "work_mode",
      type: "string",
      sample: "Presencial",
      required: false,
      description: "Modalidad de trabajo",
    },
    {
      name: "experience_level",
      type: "string",
      sample: "3-5 años",
      required: false,
      description: "Nivel de experiencia requerido",
    },
    {
      name: "publish_date",
      type: "date",
      sample: "2024-01-15",
      required: true,
      description: "Fecha de publicación",
    },
    {
      name: "application_url",
      type: "url",
      sample: "https://turijobs.com/apply/12345",
      required: true,
      description: "URL para aplicar a la oferta",
    },
    {
      name: "job_category",
      type: "string",
      sample: "Tecnología",
      required: false,
      description: "Categoría o sector del trabajo",
    },
  ])

  // Esquema estándar de nuestra plataforma
  const [targetFields] = useState([
    { name: "title", type: "string", required: true, description: "Título de la oferta" },
    { name: "company", type: "string", required: true, description: "Nombre de la empresa" },
    { name: "description", type: "text", required: false, description: "Descripción del puesto" },
    { name: "location", type: "string", required: true, description: "Ubicación" },
    { name: "salary_min", type: "number", required: false, description: "Salario mínimo" },
    { name: "salary_max", type: "number", required: false, description: "Salario máximo" },
    { name: "contract_type", type: "string", required: false, description: "Tipo de contrato" },
    { name: "work_mode", type: "string", required: false, description: "Modalidad de trabajo" },
    { name: "experience_level", type: "string", required: false, description: "Experiencia requerida" },
    { name: "published_at", type: "date", required: true, description: "Fecha de publicación" },
    { name: "apply_url", type: "url", required: true, description: "URL de aplicación" },
    { name: "sector", type: "string", required: false, description: "Sector o categoría" },
  ])

  // Estado del mapeo actual
  const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>({
    title: "job_title",
    company: "company_name",
    location: "location_city",
    published_at: "publish_date",
    apply_url: "application_url",
  })

  // Transformaciones adicionales
  const [transformations, setTransformations] = useState<{ [key: string]: string }>({})

  // Estado de vista previa
  const [showPreview, setShowPreview] = useState(false)

  const mapField = (targetField: string, sourceField: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [targetField]: sourceField,
    }))
  }

  const clearMapping = (targetField: string) => {
    setFieldMapping((prev) => {
      const newMapping = { ...prev }
      delete newMapping[targetField]
      return newMapping
    })
  }

  const setTransformation = (targetField: string, transformation: string) => {
    setTransformations((prev) => ({
      ...prev,
      [targetField]: transformation,
    }))
  }

  const validateMapping = () => {
    const errors = []
    const requiredTargetFields = targetFields.filter((f) => f.required)

    for (const requiredField of requiredTargetFields) {
      if (!fieldMapping[requiredField.name]) {
        errors.push(`Campo requerido "${requiredField.description}" sin mapear`)
      }
    }

    return errors
  }

  const generateSampleData = () => {
    const sample: { [key: string]: any } = {}

    for (const [targetField, sourceField] of Object.entries(fieldMapping)) {
      const sourceFieldData = sourceFields.find((f) => f.name === sourceField)
      if (sourceFieldData) {
        let value = sourceFieldData.sample

        // Aplicar transformaciones si existen
        if (transformations[targetField]) {
          switch (transformations[targetField]) {
            case "uppercase":
              value = value.toString().toUpperCase()
              break
            case "lowercase":
              value = value.toString().toLowerCase()
              break
            case "capitalize":
              value = value.toString().charAt(0).toUpperCase() + value.toString().slice(1).toLowerCase()
              break
            case "trim":
              value = value.toString().trim()
              break
          }
        }

        sample[targetField] = value
      }
    }

    return sample
  }

  const saveMapping = () => {
    const errors = validateMapping()
    if (errors.length > 0) {
      toast({
        title: "Error en el mapeo",
        description: errors.join(", "),
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Mapeo guardado exitosamente",
      description: "La configuración de mapeo ha sido guardada y está lista para usar",
    })

    console.log("Mapeo guardado:", { fieldMapping, transformations })
  }

  const testMapping = () => {
    toast({
      title: "Probando mapeo",
      description: "Ejecutando prueba con datos de muestra...",
    })

    // Simular prueba
    setTimeout(() => {
      toast({
        title: "Prueba exitosa",
        description: "El mapeo funciona correctamente con los datos de muestra",
      })
    }, 2000)
  }

  const sampleData = generateSampleData()
  const validationErrors = validateMapping()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Button variant="outline" size="sm" asChild>
          <Link href="/conexiones">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Conexiones
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Mapeo de Campos</h1>
          <p className="text-muted-foreground">
            Configura cómo se mapean los datos de "{conexion.name}" a nuestro esquema
          </p>
        </div>
      </div>

      {/* Info de la conexión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Información de la Conexión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm font-medium">Nombre</Label>
              <p className="text-sm text-muted-foreground">{conexion.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Tipo</Label>
              <p className="text-sm text-muted-foreground">{conexion.type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">URL</Label>
              <p className="text-sm text-muted-foreground truncate">{conexion.url}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mapeo de campos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Mapeo de Campos
            </CardTitle>
            <CardDescription>Conecta los campos de origen con nuestro esquema estándar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo Destino</TableHead>
                  <TableHead>Campo Origen</TableHead>
                  <TableHead>Transformación</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targetFields.map((targetField) => (
                  <TableRow key={targetField.name}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{targetField.description}</span>
                          {targetField.required && (
                            <Badge variant="destructive" className="text-xs">
                              Requerido
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {targetField.name} ({targetField.type})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={fieldMapping[targetField.name] || "none"}
                        onValueChange={(value) => mapField(targetField.name, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar campo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin mapear</SelectItem>
                          {sourceFields.map((sourceField) => (
                            <SelectItem key={sourceField.name} value={sourceField.name}>
                              <div className="flex flex-col">
                                <span>{sourceField.description}</span>
                                <span className="text-xs text-muted-foreground">
                                  {sourceField.name} • Ej: {sourceField.sample}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={transformations[targetField.name] || "none"}
                        onValueChange={(value) => setTransformation(targetField.name, value)}
                        disabled={!fieldMapping[targetField.name]}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sin transformación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin transformación</SelectItem>
                          <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                          <SelectItem value="lowercase">minúsculas</SelectItem>
                          <SelectItem value="capitalize">Capitalizar</SelectItem>
                          <SelectItem value="trim">Quitar espacios</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {fieldMapping[targetField.name] && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => clearMapping(targetField.name)}
                          className="text-red-600"
                        >
                          Limpiar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Campos de origen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Campos Detectados
              </CardTitle>
              <CardDescription>Campos disponibles en la fuente de datos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {sourceFields.map((field) => (
                  <div key={field.name} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{field.description}</span>
                      {field.required && (
                        <Badge variant="outline" className="text-xs">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div>
                        {field.name} ({field.type})
                      </div>
                      <div className="mt-1">
                        <strong>Ejemplo:</strong> {field.sample}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estado de validación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Estado del Mapeo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Campos mapeados</span>
                  <span className="font-medium">
                    {Object.keys(fieldMapping).length} / {targetFields.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Campos requeridos</span>
                  <span className="font-medium">
                    {targetFields.filter((f) => f.required).length - validationErrors.length} /{" "}
                    {targetFields.filter((f) => f.required).length}
                  </span>
                </div>
                {validationErrors.length === 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Mapeo válido</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Errores de validación</span>
                    </div>
                    <ul className="text-xs text-red-600 space-y-1 ml-6">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="space-y-2">
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Ocultar" : "Ver"} Vista Previa
            </Button>
            <Button onClick={testMapping} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Probar Mapeo
            </Button>
            <Button onClick={saveMapping} className="w-full" disabled={validationErrors.length > 0}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Mapeo
            </Button>
          </div>
        </div>
      </div>

      {/* Vista previa de datos */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa de Datos Mapeados
            </CardTitle>
            <CardDescription>Así quedarían los datos después del mapeo y transformaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(sampleData).map(([field, value]) => (
                  <div key={field} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">
                        {targetFields.find((f) => f.name === field)?.description}
                      </Label>
                      {transformations[field] && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {transformations[field]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{value}</p>
                    <p className="text-xs text-muted-foreground">Origen: {fieldMapping[field]}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
