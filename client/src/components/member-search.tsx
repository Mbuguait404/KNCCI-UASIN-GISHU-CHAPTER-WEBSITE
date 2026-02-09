import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, X, Check, User, UserX, Loader2 } from "lucide-react";
import { membersList, memberCount } from "@/data/members";

export interface Member {
  name: string;
  email: string;
}

interface MemberSearchProps {
  value: Member | null;
  onChange: (member: Member | null, isMember: boolean) => void;
  disabled?: boolean;
}

export function MemberSearch({ value, onChange, disabled }: MemberSearchProps) {
  const [searchQuery, setSearchQuery] = useState(value?.name || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 1) {
      setFilteredMembers([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = membersList.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMember = (member: Member) => {
    setSearchQuery(member.name);
    setIsOpen(false);
    onChange(member, true);
  };

  const handleSelectNonMember = () => {
    setSearchQuery("");
    setIsOpen(false);
    onChange(null, false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilteredMembers([]);
    onChange(null, false);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor="member-search">Search Member Name *</Label>
        <Badge variant="secondary" className="text-xs">
          {memberCount} members available
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          id="member-search"
          type="text"
          placeholder="Type a name to search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            onChange(null, false);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Selected Status */}
      {value && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">
            <span className="font-semibold">{value.name}</span> - Member verified
          </span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && searchQuery.length >= 1 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : filteredMembers.length > 0 ? (
            <>
              <div className="p-2 text-xs text-muted-foreground border-b border-border">
                {filteredMembers.length} match{filteredMembers.length !== 1 ? 'es' : ''} found
              </div>
              {filteredMembers.map((member, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectMember(member)}
                  className="w-full text-left px-4 py-3 hover:bg-accent border-b border-border last:border-0 flex items-center gap-3"
                >
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {highlightMatch(member.name, searchQuery)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No members found matching &quot;{searchQuery}&quot;
            </div>
          )}

          {/* Non-member option */}
          <button
            type="button"
            onClick={handleSelectNonMember}
            className="w-full text-left px-4 py-3 hover:bg-accent border-t border-border bg-muted/30 flex items-center gap-3"
          >
            <UserX className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="font-medium">Not a member</div>
              <div className="text-xs text-muted-foreground">
                Register as non-member (KES 40,000)
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
