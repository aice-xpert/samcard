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
import { useState, useRef } from 'react';

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
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-gradient-to-r from-[#008001] to-[#49B618]' : 'bg-[#333]'}`}>
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
  
  const handleToggle = () => {
    const turningOn = !section.enabled;
    onToggle(section.id, 'enabled');
    if (turningOn && !section.expanded) onToggle(section.id, 'expanded');
    if (!turningOn && section.expanded) onToggle(section.id, 'expanded');
  };

  const renderFields = () => {
    switch (section.type) {
      case 'extra-button':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Button Label</Label>
              <Input 
                value={(section.data.btnLabel as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'btnLabel', e.target.value)} 
                placeholder="Click here" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Button URL</Label>
              <Input 
                value={(section.data.btnUrl as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'btnUrl', e.target.value)} 
                placeholder="https://..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
          </div>
        );
      case 'extra-pdf':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">PDF Title</Label>
              <Input 
                value={(section.data.pdfTitle as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'pdfTitle', e.target.value)} 
                placeholder="Our Brochure" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">PDF URL</Label>
              <Input 
                value={(section.data.pdfUrl as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'pdfUrl', e.target.value)} 
                placeholder="https://example.com/brochure.pdf" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
          </div>
        );
      case 'extra-imagetext':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Image</Label>
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
                  <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl cursor-pointer transition-colors border-dashed border-2 border-[#008001]/30 bg-[#0D0D0D] hover:bg-[#008001]/10">
                    <Upload className="w-5 h-5 text-[#49B618] mb-1" />
                    <span className="text-xs text-[#A0A0A0]">Upload Image</span>
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
              <Label className="text-[#A0A0A0] text-xs">Heading</Label>
              <Input 
                value={(section.data.heading as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'heading', e.target.value)} 
                placeholder="Section heading..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Body Text</Label>
              <Textarea 
                value={(section.data.body as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'body', e.target.value)} 
                placeholder="Description..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
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
              <Label className="text-[#A0A0A0] text-xs">Section Title</Label>
              <Input 
                value={(section.data.title as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'title', e.target.value)} 
                placeholder={section.type === 'extra-team' ? 'Meet Our Team' : 'Our Customers'} 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Description</Label>
              <Textarea 
                value={(section.data.desc as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'desc', e.target.value)} 
                placeholder="Add a description..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
                rows={3} 
              />
            </div>
          </div>
        );
      case 'extra-products':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Product Name</Label>
              <Input 
                value={(section.data.productName as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'productName', e.target.value)} 
                placeholder="Product name" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Price</Label>
              <Input 
                value={(section.data.price as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'price', e.target.value)} 
                placeholder="$99" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Buy Link</Label>
              <Input 
                value={(section.data.buyUrl as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'buyUrl', e.target.value)} 
                placeholder="https://..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
          </div>
        );
      case 'extra-hours':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Monday–Friday</Label>
              <Input 
                value={(section.data['Monday–Friday'] as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'Monday–Friday', e.target.value)} 
                placeholder="9:00 AM - 5:00 PM" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Saturday</Label>
              <Input 
                value={(section.data.Saturday as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'Saturday', e.target.value)} 
                placeholder="10:00 AM - 2:00 PM" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Sunday</Label>
              <Input 
                value={(section.data.Sunday as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'Sunday', e.target.value)} 
                placeholder="Closed" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
          </div>
        );
      case 'extra-video':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Video URL</Label>
              <Input 
                value={(section.data.videoUrl as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'videoUrl', e.target.value)} 
                placeholder="https://youtube.com/watch?v=..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Title</Label>
              <Input 
                value={(section.data.title as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'title', e.target.value)} 
                placeholder="Section title" 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
              />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Content</Label>
              <Textarea 
                value={(section.data.content as string) ?? ''} 
                onChange={e => onUpdateData(section.id, 'content', e.target.value)} 
                placeholder="Content..." 
                className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" 
                rows={4} 
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card 
      className={`bg-[#000000] border-[#008001]/30 overflow-hidden scroll-mt-4 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-2xl scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#008001]/20">
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-md hover:bg-[#008001]/20 transition-colors"
            style={{ touchAction: 'none' }}
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-[#555] cursor-grab active:cursor-grabbing flex-shrink-0" />
          </div>
          <Icon className="w-4 h-4 text-[#49B618] flex-shrink-0" />
          <span className="font-semibold text-white text-sm truncate">{section.label}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
          <Toggle checked={section.enabled} onChange={handleToggle} />
          <button 
            type="button" 
            onClick={() => onToggle(section.id, 'expanded')} 
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors"
          >
            {section.expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button 
            type="button" 
            onClick={() => onRemove(section.id)} 
            className="w-7 h-7 rounded-md flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {section.expanded && <CardContent className="p-4 sm:p-6">{renderFields()}</CardContent>}
    </Card>
  );
}