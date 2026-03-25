import { Bell, ChevronDown, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';

interface EnhancedHeaderProps {
  title: string;
  subtitle?: string;
  showDateFilter?: boolean;
  dateRange?: string;
  onDateRangeChange?: (value: string) => void;
}

export function EnhancedHeader({ 
  title, 
  subtitle = 'Dashboard / Home',
  showDateFilter = false,
  dateRange = '7',
  onDateRangeChange
}: EnhancedHeaderProps) {
  const { profile } = useUser();
  const initials = profile.name.split(" ").map(n => n[0]).join("").toUpperCase();
  return (
    <header className="h-16 border-b border-[#008001]/30 bg-[#000000]/95 backdrop-blur-xl px-8 flex items-center justify-between shadow-sm">
      {/* Left side - Search and Breadcrumb */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 bg-[#1E1E1E] border-[#008001]/30 text-sm text-white placeholder:text-[#A0A0A0] focus:border-[#49B618] focus:ring-[#49B618]/20"
          />
        </div>
        <div>
          <p className="text-xs text-[#A0A0A0]">{subtitle}</p>
          <h2 className="text-base bg-gradient-to-r from-[#49B618] to-[#009200] bg-clip-text text-transparent font-semibold">{title}</h2>
        </div>
      </div>

      {/* Right side - Date filter, Notifications, User */}
      <div className="flex items-center gap-4">
        {showDateFilter && (
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-32 bg-[#1E1E1E] border-[#008001]/30 text-sm text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#000000] border-[#008001]/30">
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Notifications with Badge */}
        <Button variant="ghost" size="icon" className="relative bg-[#1E1E1E] hover:bg-[#008001]/20">
          <Bell className="w-5 h-5 text-[#49B618]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#49B618] to-[#009200] rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 bg-[#1E1E1E] hover:bg-[#008001]/20 px-3 text-white">
              <Avatar className="w-8 h-8 ring-2 ring-[#008001]/30">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} />
                ) : (
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                )}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm text-white font-medium">{profile.name}</p>
                <p className="text-xs text-[#A0A0A0]">Pro Member</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#000000] border-[#008001]/30">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#008001]/30" />
            <DropdownMenuItem className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20">Billing</DropdownMenuItem>
            <DropdownMenuItem className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20">Team</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#008001]/30" />
            <DropdownMenuItem className="text-[#A0A0A0] focus:text-white focus:bg-[#008001]/20">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}