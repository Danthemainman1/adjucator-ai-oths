import React, { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Wand2, Download, RotateCcw, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'
import { Card, CardHeader, Button, Select, Badge, Textarea } from '../components/ui'
import { useAppStore } from '../store'
import { callGeminiAPI } from '../utils/api'
import { cn } from '../utils/helpers'
import MarkdownRenderer from '../components/shared/MarkdownRenderer'

const BoardEvaluation = () => {
  const { settings, addToHistory } = useAppStore()
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [context, setContext] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [annotations, setAnnotations] = useState([])
  const [evaluationType, setEvaluationType] = useState('strategy')
  
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const evaluationTypes = [
    { value: 'strategy', label: 'Strategic Analysis' },
    { value: 'position', label: 'Position Evaluation' },
    { value: 'flow', label: 'Game Flow' },
    { value: 'full', label: 'Complete Evaluation' }
  ]

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setEvaluation(null)
      setAnnotations([])
    }
  }

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setEvaluation(null)
      setAnnotations([])
    }
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Analyze image
  const analyzeBoard = async () => {
    if (!imagePreview || !settings.apiKey) return

    setIsAnalyzing(true)

    const typePrompts = {
      strategy: 'Analyze the strategic elements of this board/diagram. Focus on positioning, control, and tactical opportunities.',
      position: 'Evaluate the current position. Assess strengths, weaknesses, and balance of the position.',
      flow: 'Analyze the flow and progression of the game/debate. What patterns are emerging?',
      full: 'Provide a comprehensive evaluation covering strategy, position, flow, and recommendations.'
    }

    const prompt = `You are an expert analyst evaluating a board/diagram image for a debate or strategy game.

${typePrompts[evaluationType]}

${context ? `Additional Context: ${context}` : ''}

Please provide:
1. **Overview**: What you see in the image
2. **Analysis**: Detailed evaluation based on the type requested
3. **Key Points**: Highlight 3-5 important observations
4. **Recommendations**: Actionable advice
5. **Rating**: If applicable, rate the position/strategy (1-10)

Format your response in clear markdown with headers.`

    try {
      // For Gemini, we need to use the vision model
      const response = await callGeminiAPI(
        settings.apiKey,
        prompt,
        settings.model || 'gemini-2.5-flash',
        imagePreview
      )

      if (response) {
        setEvaluation(response)
        
        // Generate mock annotations for demo
        setAnnotations([
          { id: 1, x: 20, y: 30, label: 'Key Point A', color: 'cyan' },
          { id: 2, x: 60, y: 50, label: 'Area of Interest', color: 'purple' },
          { id: 3, x: 40, y: 70, label: 'Strategic Position', color: 'amber' }
        ])

        // Save to history
        addToHistory({
          type: 'board-evaluation',
          evaluationType,
          result: response.slice(0, 200) + '...',
          timestamp: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Error analyzing image:', err)
      setEvaluation('Error analyzing image. Please ensure you have a valid API key and the image is clear.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Download annotated image
  const downloadAnnotated = () => {
    if (!canvasRef.current || !imagePreview) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      // Draw annotations
      annotations.forEach(ann => {
        const x = (ann.x / 100) * img.width
        const y = (ann.y / 100) * img.height
        
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, 2 * Math.PI)
        ctx.strokeStyle = ann.color === 'cyan' ? '#06b6d4' : 
                          ann.color === 'purple' ? '#a855f7' : '#f59e0b'
        ctx.lineWidth = 3
        ctx.stroke()
        
        ctx.fillStyle = 'white'
        ctx.font = '14px sans-serif'
        ctx.fillText(ann.label, x + 25, y + 5)
      })

      const link = document.createElement('a')
      link.download = 'annotated-board.png'
      link.href = canvas.toDataURL()
      link.click()
    }
    
    img.src = imagePreview
  }

  // Reset
  const handleReset = () => {
    setImage(null)
    setImagePreview(null)
    setEvaluation(null)
    setAnnotations([])
    setContext('')
    setZoom(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Board Evaluation</h1>
          <p className="text-slate-400 mt-1">AI-powered visual analysis of boards and diagrams</p>
        </div>
        <Select
          value={evaluationType}
          onChange={(e) => setEvaluationType(e.target.value)}
          options={evaluationTypes}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Area */}
        <div className="space-y-4">
          <Card className="p-6">
            <CardHeader
              title="Upload Image"
              icon={<Camera className="h-5 w-5 text-cyan-400" />}
            />
            
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="mt-4 border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
              >
                <Upload className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                <p className="text-slate-400 mb-2">
                  Drag and drop an image, or click to upload
                </p>
                <p className="text-xs text-slate-500">
                  Supports PNG, JPG, WEBP up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Image Preview */}
                <div className="relative overflow-hidden rounded-xl bg-slate-900">
                  <div 
                    className="relative transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <img
                      src={imagePreview}
                      alt="Board preview"
                      className="w-full h-auto"
                    />
                    
                    {/* Annotations overlay */}
                    {annotations.map(ann => (
                      <div
                        key={ann.id}
                        className={cn(
                          "absolute w-10 h-10 rounded-full border-2 flex items-center justify-center",
                          ann.color === 'cyan' && "border-cyan-400",
                          ann.color === 'purple' && "border-purple-400",
                          ann.color === 'amber' && "border-amber-400"
                        )}
                        style={{
                          left: `${ann.x}%`,
                          top: `${ann.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <Badge 
                          variant="default"
                          className={cn(
                            "absolute -top-8 whitespace-nowrap text-xs",
                            ann.color === 'cyan' && "bg-cyan-500/80",
                            ann.color === 'purple' && "bg-purple-500/80",
                            ann.color === 'amber' && "bg-amber-500/80"
                          )}
                        >
                          {ann.label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-400 w-16 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleReset} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  {evaluation && (
                    <Button variant="ghost" onClick={downloadAnnotated} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Context Input */}
          <Card className="p-6">
            <CardHeader title="Additional Context" />
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide any additional context about the board state, game rules, or specific areas to focus on..."
              className="mt-4"
              rows={4}
            />
            
            <Button
              onClick={analyzeBoard}
              disabled={!imagePreview || isAnalyzing || !settings.apiKey}
              className="w-full mt-4"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Analyze Board
                </>
              )}
            </Button>

            {!settings.apiKey && (
              <p className="text-xs text-amber-400 mt-2 text-center">
                Configure your API key in Settings to enable analysis
              </p>
            )}
          </Card>
        </div>

        {/* Results */}
        <Card className="p-6">
          <CardHeader
            title="Evaluation Results"
            icon={<Wand2 className="h-5 w-5 text-purple-400" />}
          />
          
          <div className="mt-4 min-h-[400px]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-t-cyan-500 rounded-full animate-spin" />
                </div>
                <p className="mt-4 text-slate-400">Analyzing your board...</p>
                <p className="text-xs text-slate-500 mt-1">This may take a moment</p>
              </div>
            ) : evaluation ? (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={evaluation} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Camera className="h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-400 mb-2">No evaluation yet</p>
                <p className="text-xs text-slate-500">
                  Upload an image and click "Analyze Board" to get started
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Hidden canvas for image export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default BoardEvaluation
