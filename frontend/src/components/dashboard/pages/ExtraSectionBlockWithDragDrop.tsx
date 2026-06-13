{/* theme: converted */}
"use client";

import { Card, CardContent } from '@/components/dashboard/ui/card';
import { Label } from '@/components/dashboard/ui/label';
import { Input } from '@/components/dashboard/ui/input';
import { Textarea } from '@/components/dashboard/ui/textarea';
import { Button } from '@/components/dashboard/ui/button';
import { ExtraSection } from '@/components/dashboard/pages/PhonePreview';
import { 
  GripVertical, Plus, Minus, X, Upload, Trash2, 
  LayoutTemplate, MousePointerClick, FileText, UserCheck, 
  Users, ShoppingBag, Megaphone, Calendar, Link2, Share2, Mail 
} from 'lucide-react';
import Image from 'next/image';
import { uploadFile } from '@/lib/api';
import { useState, useRef, useCallback } from 'react';

// ── Validation helpers ──────────────────────────────────────────────
const URL_RE = /^https?:\/\/.+\..+/i;
const TIME_RE = /^[\d\s:AMPamp\-–—,.]{3,}$/;

function validateUrl(v: string): string | null {
  if (!v.trim()) return null;
  if (!v.startsWith('http://') && !v.startsWith('https://')) {
    v = 'https://' + v;
  }
  return URL_RE.test(v) ? null : 'Enter a valid URL (e.g. https://example.com)';
}

function validatePrice(v: string): string | null {
  if (!v.trim()) return null;
  return /^[\d.,\s$€£¥₹,]{1,20}$/.test(v.trim()) ? null : 'Enter a valid price (e.g. $99.99)';
}

function validateHours(v: string): string | null {
  if (!v.trim()) return null;
  return v.trim().length >= 2 ? null : 'Enter hours (e.g. 9:00 AM - 5:00 PM or "Closed")';
}

interface ExtraSectionBlockWithDragDropProps {
  section: ExtraSection;
  index: number;
  onToggle: (id: string, field: 'enabled' | 'expanded') => void;
  onRemove: (id: string) => void;
  onUpdateData: (id: string, field: string, value: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

const ADDABLE_COMPONENTS = [
  { key: 'appointment', label: 'Appointment / Calendar', icon: Calendar, group: 'builtin' },
  { key: 'headingText', label: 'Title + Text', icon: LayoutTemplate, group: 'builtin' },
  { key: 'links', label: 'Links', icon: Link2, group: 'builtin' },
  { key: 'socialLinks', label: 'Social Links', icon: Share2, group: 'builtin' },
  { key: 'contactUs', label: 'Contact Us', icon: Mail, group: 'builtin' },
  { key: 'collectContacts', label: 'Collect Contacts', icon: Users, group: 'builtin' },
  { key: 'extra-button', label: 'Button', icon: MousePointerClick, group: 'extra' },
  { key: 'extra-pdf', label: 'PDF Gallery', icon: FileText, group: 'extra' },
  { key: 'extra-other', label: 'Other Details', icon: LayoutTemplate, group: 'extra' },
  { key: 'extra-team', label: 'Team', icon: UserCheck, group: 'extra' },
  { key: 'extra-customer', label: 'Customer', icon: Users, group: 'extra' },
  { key: 'extra-products', label: 'Products', icon: ShoppingBag, group: 'extra' },
  { key: 'extra-imagetext', label: 'Image', icon: Megaphone, group: 'extra' },
  { key: 'extra-hours', label: 'Business Hours', icon: Calendar, group: 'extra' },
  { key: 'extra-video', label: 'Video', icon: LayoutTemplate, group: 'extra' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function ExtraSectionBlockWithDragDrop({ 
  section, 
  index, 
  onToggle, 
  onRemove, 
  onUpdateData,
  dragHandleProps,
  isDragging 
}: ExtraSectionBlockWithDragDropProps) {
  const comp = ADDABLE_COMPONENTS.find(c => c.key === section.type);
  const Icon = comp?.icon ?? LayoutTemplate;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const setError = useCallback((field: string, error: string | null) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validateOnBlur = useCallback((field: string, value: string) => {
    let error: string | null = null;
    switch (field) {
      case 'btnUrl':
      case 'videoUrl':
      case 'pdfUrl':
      case 'buyUrl':
        error = validateUrl(value); break;
      case 'price':
        error = validatePrice(value); break;
      case 'Monday–Friday':
      case 'Saturday':
      case 'Sunday':
        error = validateHours(value); break;
    }
    setError(field, error);
  }, [setError]);

  const handleChange = useCallback((field: string, value: string) => {
    onUpdateData(section.id, field, value);
    setError(field, null);
  }, [section.id, onUpdateData, setError]);

  const handleToggle = () => {
    const turningOn = !section.enabled;
    onToggle(section.id, 'enabled');
    if (turningOn && !section.expanded) onToggle(section.id, 'expanded');
    if (!turningOn && section.expanded) onToggle(section.id, 'expanded');
  };

  const renderFields = () => {
    const field = (name: string, label: string, placeholder: string, opts?: { type?: string }) => {
      const err = fieldErrors[name];
      return (
        <div>
          <Label className="text-muted-foreground text-xs">{label}</Label>
          <Input
            type={opts?.type ?? 'text'}
            value={(section.data[name] as string) ?? ''}
            onChange={e => handleChange(name, e.target.value)}
            onBlur={() => validateOnBlur(name, (section.data[name] as string) ?? '')}
            placeholder={placeholder}
            className={`mt-1 bg-input border-border text-foreground ${err ? 'border-destructive' : ''}`}
          />
          {err && <p className="text-destructive text-[10px] mt-1">{err}</p>}
        </div>
      );
    };

    switch (section.type) {
      case 'extra-button':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Button Label</Label>
              <Input 
                value={(section.data.btnLabel as string) ?? ''} 
                onChange={e => handleChange('btnLabel', e.target.value)} 
                placeholder="Click here" 
                className="mt-1 bg-input border-border text-foreground" 
              />
            </div>
            {field('btnUrl', 'Button URL', 'https://...')}
          </div>
        );
      case 'extra-pdf':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">PDF Title</Label>
              <Input 
                value={(section.data.pdfTitle as string) ?? ''} 
                onChange={e => handleChange('pdfTitle', e.target.value)} 
                placeholder="Our Brochure" 
                className="mt-1 bg-input border-border text-foreground" 
              />
            </div>
            {field('pdfUrl', 'PDF URL', 'https://example.com/brochure.pdf')}
          </div>
        );
      case 'extra-imagetext':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Image</Label>
              <div className="mt-1 relative">
                {section.data.imgUrl ? (
                  <div className="relative group w-full h-32 rounded-xl overflow-hidden">
                    <Image src={section.data.imgUrl as string} alt="" fill className="object-cover" />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-xl">
                      <Upload className="w-5 h-5 text-white" />
                      <input type="file" accept="image/*" className="hidden"
                        onChange={async e => {
                          const file = e.target.files?.[0]; if (!file) return;
                          try {
                            const res = await uploadFile(file);
                            onUpdateData(section.id, 'imgUrl', res.url);
                          } catch (err: any) {
                            alert('Upload failed: ' + err.message);
                          }
                        }} />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl cursor-pointer transition-colors border-dashed border-2 border-primary/30 bg-muted/30 hover:bg-primary/10">
                    <Upload className="w-5 h-5 text-accent mb-1" />
                    <span className="text-xs text-muted-foreground">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0]; if (!file) return;
                        try {
                          const res = await uploadFile(file);
                          onUpdateData(section.id, 'imgUrl', res.url);
                        } catch (err: any) {
                          alert('Upload failed: ' + err.message);
                        }
                      }} />
                  </label>
                )}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Heading</Label>
              <Input 
                value={(section.data.heading as string) ?? ''} 
                onChange={e => handleChange('heading', e.target.value)} 
                placeholder="Section heading..." 
                className="mt-1 bg-input border-border text-foreground" 
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Body Text</Label>
              <Textarea 
                value={(section.data.body as string) ?? ''} 
                onChange={e => handleChange('body', e.target.value)} 
                placeholder="Description..." 
                className="mt-1 bg-input border-border text-foreground" 
                rows={3} 
              />
            </div>
          </div>
        );
      case 'extra-team':
      case 'extra-customer':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Section Title</Label>
              <Input 
                value={(section.data.title as string) ?? ''} 
                onChange={e => handleChange('title', e.target.value)} 
                placeholder={section.type === 'extra-team' ? 'Meet Our Team' : 'Our Customers'} 
                className="mt-1 bg-input border-border text-foreground" 
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea 
                value={(section.data.desc as string) ?? ''} 
                onChange={e => handleChange('desc', e.target.value)} 
                placeholder="Add a description..." 
                className="mt-1 bg-input border-border text-foreground" 
                rows={3} 
              />
            </div>
          </div>
        );
      case 'extra-products':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Product Name</Label>
              <Input 
                value={(section.data.productName as string) ?? ''} 
                onChange={e => handleChange('productName', e.target.value)} 
                placeholder="Product name" 
                className="mt-1 bg-input border-border text-foreground" 
              />
            </div>
            {field('price', 'Price', '$99')}
            {field('buyUrl', 'Buy Link', 'https://...')}
          </div>
        );
      case 'extra-hours':
        return (
          <div className="space-y-3">
            {field('Monday–Friday', 'Monday–Friday', '9:00 AM - 5:00 PM')}
            {field('Saturday', 'Saturday', '10:00 AM - 2:00 PM')}
            {field('Sunday', 'Sunday', 'Closed')}
          </div>
        );
      case 'extra-video':
        return (
          <div className="space-y-3">
            {field('videoUrl', 'Video URL', 'https://youtube.com/watch?v=...')}
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Title</Label>
              <Input 
                value={(section.data.title as string) ?? ''} 
                onChange={e => handleChange('title', e.target.value)} 
                placeholder="Section title" 
                className="mt-1 bg-input border-border text-foreground" 
              />
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Content</Label>
              <Textarea 
                value={(section.data.content as string) ?? ''} 
                onChange={e => handleChange('content', e.target.value)} 
                placeholder="Content..." 
                className="mt-1 bg-input border-border text-foreground" 
                rows={4} 
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card 
      className={`bg-card border-border overflow-hidden scroll-mt-4 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-2xl scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-md hover:bg-accent/20 transition-colors"
            style={{ touchAction: 'none' }}
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0" />
          </div>
          <Icon className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="font-semibold text-foreground text-sm truncate">{section.label}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
          <Toggle checked={section.enabled} onChange={handleToggle} />
          <button 
            type="button" 
            onClick={() => onToggle(section.id, 'expanded')} 
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors"
          >
            {section.expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button 
            type="button" 
            onClick={() => onRemove(section.id)} 
            className="w-7 h-7 rounded-md flex items-center justify-center text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {section.expanded && <CardContent className="p-4 sm:p-6">{renderFields()}</CardContent>}
    </Card>
  );
}