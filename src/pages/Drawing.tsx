import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  PenTool, 
  Square, 
  Circle, 
  Triangle, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Move, 
  ZoomIn, 
  ZoomOut,
  Grid,
  Layers,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Shape {
  id: string
  type: "rectangle" | "circle" | "polygon" | "text"
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  points?: string
  text?: string
  fill: string
  stroke: string
  metadata: {
    label: string
    vessel?: string
    compartment?: string
    surveyId?: string
    damageType?: string
    severity?: string
    notes?: string
    createdBy: string
    createdOn: string
  }
}

const severityColors = {
  "Low": "#28A745",
  "Medium": "#FFC107", 
  "High": "#FF6B35",
  "Critical": "#D72638"
}

const vessels = ["INS Vikrant", "INS Kolkata", "INS Vikramaditya"]
const compartments = ["Forward Compartment A", "Engine Room", "Control Room", "Storage Bay"]
const damageTypes = ["Corrosion", "Crack", "Wear", "Deformation", "Electrical"]
const severities = ["Low", "Medium", "High", "Critical"]

export default function Drawing() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedTool, setSelectedTool] = useState<"select" | "rectangle" | "circle" | "polygon" | "text">("select")
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [currentShape, setCurrentShape] = useState<Partial<Shape> | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [layers, setLayers] = useState({
    survey: true,
    docking: true,
    equipment: true
  })
  const [isMetadataOpen, setIsMetadataOpen] = useState(false)
  const [shapeMetadata, setShapeMetadata] = useState({
    label: "",
    vessel: "",
    compartment: "",
    damageType: "",
    severity: "",
    notes: ""
  })
  const { toast } = useToast()

  // Sample shapes for demo
  useEffect(() => {
    const sampleShapes: Shape[] = [
      {
        id: "1",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 120,
        height: 80,
        fill: severityColors.Medium,
        stroke: "#333",
        metadata: {
          label: "RS-01",
          vessel: "INS Vikrant",
          compartment: "Forward Compartment A",
          damageType: "Corrosion",
          severity: "Medium",
          notes: "Minor corrosion observed on hull plating",
          createdBy: "Lt. Naval",
          createdOn: "2024-01-15"
        }
      },
      {
        id: "2", 
        type: "circle",
        x: 300,
        y: 150,
        radius: 40,
        fill: severityColors.High,
        stroke: "#333",
        metadata: {
          label: "RS-02",
          vessel: "INS Vikrant",
          compartment: "Engine Room",
          damageType: "Crack",
          severity: "High",
          notes: "Structural crack requiring immediate attention",
          createdBy: "Lt. Marine",
          createdOn: "2024-01-16"
        }
      }
    ]
    setShapes(sampleShapes)
  }, [])

  const getMousePosition = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    
    const rect = svg.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    }
  }

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (selectedTool === "select") return
    
    const point = getMousePosition(e)
    setStartPoint(point)
    setIsDrawing(true)
    
    const newShape: Partial<Shape> = {
      id: Date.now().toString(),
      type: selectedTool,
      x: point.x,
      y: point.y,
      fill: severityColors.Low,
      stroke: "#333",
      metadata: {
        label: `RS-${shapes.length + 1}`,
        createdBy: "Current User",
        createdOn: new Date().toISOString().split('T')[0]
      }
    }
    
    if (selectedTool === "text") {
      newShape.text = "Label"
    }
    
    setCurrentShape(newShape)
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !currentShape) return
    
    const point = getMousePosition(e)
    
    if (selectedTool === "rectangle") {
      setCurrentShape(prev => prev ? {
        ...prev,
        width: Math.abs(point.x - startPoint.x),
        height: Math.abs(point.y - startPoint.y),
        x: Math.min(startPoint.x, point.x),
        y: Math.min(startPoint.y, point.y)
      } : null)
    } else if (selectedTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
      )
      setCurrentShape(prev => prev ? {
        ...prev,
        radius
      } : null)
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      if (selectedTool === "text" || 
          (selectedTool === "rectangle" && currentShape.width && currentShape.height) ||
          (selectedTool === "circle" && currentShape.radius)) {
        setShapes(prev => [...prev, currentShape as Shape])
        toast({ title: "Success", description: `${selectedTool} added to drawing` })
      }
    }
    setIsDrawing(false)
    setCurrentShape(null)
  }

  const handleShapeClick = (shape: Shape) => {
    if (selectedTool === "select") {
      setSelectedShape(shape)
      setShapeMetadata({
        label: shape.metadata.label,
        vessel: shape.metadata.vessel || "",
        compartment: shape.metadata.compartment || "",
        damageType: shape.metadata.damageType || "",
        severity: shape.metadata.severity || "",
        notes: shape.metadata.notes || ""
      })
      setIsMetadataOpen(true)
    }
  }

  const handleDeleteShape = (shapeId: string) => {
    setShapes(prev => prev.filter(s => s.id !== shapeId))
    setSelectedShape(null)
    toast({ title: "Success", description: "Shape deleted" })
  }

  const handleSaveMetadata = () => {
    if (!selectedShape) return
    
    setShapes(prev => prev.map(shape => 
      shape.id === selectedShape.id 
        ? {
            ...shape,
            fill: shapeMetadata.severity ? severityColors[shapeMetadata.severity as keyof typeof severityColors] : shape.fill,
            metadata: {
              ...shape.metadata,
              ...shapeMetadata
            }
          }
        : shape
    ))
    setIsMetadataOpen(false)
    toast({ title: "Success", description: "Shape metadata updated" })
  }

  const exportDrawing = () => {
    const svg = svgRef.current
    if (!svg) return
    
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = "hull-drawing.svg"
    link.click()
    
    URL.revokeObjectURL(url)
    toast({ title: "Success", description: "Drawing exported successfully" })
  }

  const renderShape = (shape: Shape) => {
    const isVisible = (
      (shape.metadata.damageType && layers.survey) ||
      (!shape.metadata.damageType && layers.equipment)
    )
    
    if (!isVisible) return null

    const commonProps = {
      key: shape.id,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: 2,
      onClick: () => handleShapeClick(shape),
      className: "cursor-pointer hover:opacity-80",
      opacity: selectedShape?.id === shape.id ? 0.8 : 1
    }

    switch (shape.type) {
      case "rectangle":
        return (
          <rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
          />
        )
      case "circle":
        return (
          <circle
            {...commonProps}
            cx={shape.x}
            cy={shape.y}
            r={shape.radius}
          />
        )
      case "text":
        return (
          <text
            {...commonProps}
            x={shape.x}
            y={shape.y}
            fontSize="14"
            fill="#333"
          >
            {shape.metadata.label}
          </text>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interactive Drawing</h1>
          <p className="text-muted-foreground mt-2">
            Create and annotate hull diagrams with survey data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGrid(!showGrid)}>
            <Grid className="mr-2 h-4 w-4" />
            {showGrid ? "Hide" : "Show"} Grid
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={exportDrawing}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Drawing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Toolbar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drawing Tools */}
            <div className="space-y-2">
              <Label className="font-medium">Drawing Tools</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedTool === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool("select")}
                >
                  <Move className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "rectangle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool("rectangle")}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "circle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool("circle")}
                >
                  <Circle className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedTool === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool("text")}
                >
                  <PenTool className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-2">
              <Label className="font-medium">Zoom</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm py-1 px-2">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Layers */}
            <div className="space-y-2">
              <Label className="font-medium">Layers</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Survey Defects</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLayers(prev => ({ ...prev, survey: !prev.survey }))}
                  >
                    {layers.survey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Equipment</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLayers(prev => ({ ...prev, equipment: !prev.equipment }))}
                  >
                    {layers.equipment ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Drawing Canvas
            </CardTitle>
            <CardDescription>
              Click and drag to create shapes. Click on shapes to edit metadata.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden bg-background">
              <svg
                ref={svgRef}
                width="100%"
                height="500"
                viewBox="0 0 800 500"
                className="cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
                }}
              >
                {/* Grid */}
                {showGrid && (
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                )}
                {showGrid && (
                  <rect width="100%" height="100%" fill="url(#grid)" />
                )}

                {/* Existing shapes */}
                {shapes.map(renderShape)}

                {/* Current shape being drawn */}
                {currentShape && isDrawing && currentShape.type === "rectangle" && (
                  <rect
                    x={currentShape.x}
                    y={currentShape.y}
                    width={currentShape.width || 0}
                    height={currentShape.height || 0}
                    fill={currentShape.fill}
                    stroke={currentShape.stroke}
                    strokeWidth={2}
                    opacity={0.7}
                  />
                )}
                {currentShape && isDrawing && currentShape.type === "circle" && (
                  <circle
                    cx={currentShape.x}
                    cy={currentShape.y}
                    r={currentShape.radius || 0}
                    fill={currentShape.fill}
                    stroke={currentShape.stroke}
                    strokeWidth={2}
                    opacity={0.7}
                  />
                )}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shape List */}
      <Card>
        <CardHeader>
          <CardTitle>Shape Annotations</CardTitle>
          <CardDescription>
            List of all shapes and their metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {shapes.map(shape => (
              <div key={shape.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: shape.fill }}
                  />
                  <div>
                    <p className="font-medium">{shape.metadata.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {shape.metadata.vessel || "Unassigned"} • {shape.metadata.compartment || "No compartment"}
                    </p>
                  </div>
                  {shape.metadata.severity && (
                    <Badge variant="secondary">{shape.metadata.severity}</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteShape(shape.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shape Metadata Dialog */}
      <Dialog open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shape Metadata</DialogTitle>
            <DialogDescription>
              Edit the metadata for the selected shape
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={shapeMetadata.label}
                  onChange={(e) => setShapeMetadata(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Vessel</Label>
                <Select value={shapeMetadata.vessel} onValueChange={(value) => setShapeMetadata(prev => ({ ...prev, vessel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {vessels.map(vessel => (
                      <SelectItem key={vessel} value={vessel}>{vessel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Compartment</Label>
                <Select value={shapeMetadata.compartment} onValueChange={(value) => setShapeMetadata(prev => ({ ...prev, compartment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compartment" />
                  </SelectTrigger>
                  <SelectContent>
                    {compartments.map(compartment => (
                      <SelectItem key={compartment} value={compartment}>{compartment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Damage Type</Label>
                <Select value={shapeMetadata.damageType} onValueChange={(value) => setShapeMetadata(prev => ({ ...prev, damageType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select damage type" />
                  </SelectTrigger>
                  <SelectContent>
                    {damageTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={shapeMetadata.severity} onValueChange={(value) => setShapeMetadata(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map(severity => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={shapeMetadata.notes}
                onChange={(e) => setShapeMetadata(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsMetadataOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMetadata}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
