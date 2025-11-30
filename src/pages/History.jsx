import React, { useState } from 'react'
import { History as HistoryIcon, Search, Filter, Calendar, Clock, FileText, Mic, Target, Camera, Trash2, Eye, Download, ChevronDown } from 'lucide-react'
import { Card, CardHeader, Button, Input, Select, Badge } from '../components/ui'
import { useAppStore } from '../store'
import { cn, getTimeAgo } from '../utils/helpers'
import MarkdownRenderer from '../components/shared/MarkdownRenderer'

const History = () => {
  const { history, removeFromHistory, clearHistory } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [expandedItem, setExpandedItem] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'speech-analysis', label: 'Speech Analysis' },
    { value: 'live-coaching', label: 'Live Coaching' },
    { value: 'board-evaluation', label: 'Board Evaluation' },
    { value: 'strategy', label: 'Strategy' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'speech-analysis':
        return <FileText className="h-4 w-4" />
      case 'live-coaching':
        return <Mic className="h-4 w-4" />
      case 'board-evaluation':
        return <Camera className="h-4 w-4" />
      case 'strategy':
        return <Target className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'speech-analysis':
        return 'bg-cyan-500/20 text-cyan-400'
      case 'live-coaching':
        return 'bg-purple-500/20 text-purple-400'
      case 'board-evaluation':
        return 'bg-amber-500/20 text-amber-400'
      case 'strategy':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'speech-analysis':
        return 'Speech Analysis'
      case 'live-coaching':
        return 'Live Coaching'
      case 'board-evaluation':
        return 'Board Evaluation'
      case 'strategy':
        return 'Strategy'
      default:
        return type
    }
  }

  // Filter and sort history
  const filteredHistory = (history || [])
    .filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.result?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.motion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.format?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = filterType === 'all' || item.type === filterType
      
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(filteredHistory, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debate-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">History</h1>
          <p className="text-slate-400 mt-1">
            {filteredHistory.length} session{filteredHistory.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportHistory}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {history?.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to clear all history?')) {
                  clearHistory()
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={typeOptions}
              className="w-40"
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              className="w-36"
            />
          </div>
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card className="p-12 text-center">
            <HistoryIcon className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No history found</h3>
            <p className="text-sm text-slate-500">
              {history?.length === 0
                ? 'Start using the app to build your history'
                : 'Try adjusting your search or filter'}
            </p>
          </Card>
        ) : (
          filteredHistory.map((item, index) => (
            <Card
              key={item.timestamp + index}
              className={cn(
                "transition-all",
                expandedItem === index && "ring-1 ring-cyan-500/50"
              )}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedItem(expandedItem === index ? null : index)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg", getTypeColor(item.type))}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className={getTypeColor(item.type)}>
                        {getTypeLabel(item.type)}
                      </Badge>
                      {item.format && (
                        <Badge variant="secondary">{item.format}</Badge>
                      )}
                      {item.position && (
                        <Badge variant="secondary">{item.position}</Badge>
                      )}
                    </div>
                    
                    <p className="text-slate-300 line-clamp-2">
                      {item.motion || item.result?.slice(0, 150) || 'No details'}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getTimeAgo(item.timestamp)}
                      </span>
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.round(item.duration / 60)}m
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Remove this item from history?')) {
                          removeFromHistory(item.timestamp)
                        }
                      }}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-slate-500 transition-transform",
                      expandedItem === index && "rotate-180"
                    )} />
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedItem === index && (
                <div className="px-4 pb-4 border-t border-slate-800">
                  <div className="pt-4 prose prose-invert max-w-none">
                    {item.result ? (
                      <MarkdownRenderer content={item.result} />
                    ) : (
                      <p className="text-slate-500 italic">No detailed results available</p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(item.result || '')
                        alert('Copied to clipboard!')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {history?.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Showing {filteredHistory.length} of {history.length} sessions
            </span>
            <div className="flex gap-4">
              {typeOptions.slice(1).map(type => {
                const count = history.filter(h => h.type === type.value).length
                return count > 0 ? (
                  <span key={type.value} className="text-slate-500">
                    {type.label}: {count}
                  </span>
                ) : null
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default History
