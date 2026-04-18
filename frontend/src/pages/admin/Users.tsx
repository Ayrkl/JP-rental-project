import { useMemo, useState } from 'react';
import {
  Search, Eye, UserPlus, Mail, Info, Pencil, Lock, Trash2,
  ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Info as InfoIcon
} from 'lucide-react';
import { useUserStore, type User, type UserRole, type UserStatus } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

const ALL_ROLES: UserRole[] = ['Super Admin', 'Property Manager', 'Tenant', 'Accountant', 'Viewer'];
const ROWS_OPTIONS = [5, 10, 20, 50];

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_COLORS = [
  'bg-indigo-500/20 text-indigo-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-amber-500/20 text-amber-400',
  'bg-rose-500/20 text-rose-400',
  'bg-blue-500/20 text-blue-400',
  'bg-purple-500/20 text-purple-400',
];

const avatarColor = (id: string) => AVATAR_COLORS[parseInt(id, 36) % AVATAR_COLORS.length];

// ── UserForm Modal ─────────────────────────────────────────────────────────
type FormState = { name: string; email: string; phone: string; roles: UserRole[]; password: string };
const EMPTY_FORM: FormState = { name: '', email: '', phone: '', roles: [], password: '' };

const UserFormModal = ({
  open, onClose, initial, userId
}: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<FormState>;
  userId?: string;
}) => {
  const { addUser, updateUser } = useUserStore();
  const { t: tRaw } = useTranslation('users');
  const t = tRaw as unknown as (k: string) => string;

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, ...initial });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Zorunlu';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Geçersiz email';
    if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Geçersiz telefon';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (userId) {
      updateUser(userId, { name: form.name, email: form.email, phone: form.phone, roles: form.roles });
    } else {
      addUser({ name: form.name, email: form.email, phone: form.phone, roles: form.roles, status: 'active' });
    }
    onClose();
  };

  const toggleRole = (role: UserRole) => {
    setForm(f => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter(r => r !== role) : [...f.roles, role],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-[#111] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle>{userId ? t('editUser') : t('addUser')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* İsim */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">{t('fieldName')}</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-[#1a1a1a] border-[#2a2a2a]" />
            {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
          </div>
          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">{t('fieldEmail')}</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-[#1a1a1a] border-[#2a2a2a]" />
            {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
          </div>
          {/* Telefon */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">{t('fieldPhone')}</Label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-[#1a1a1a] border-[#2a2a2a]" />
            {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
          </div>
          {/* Roller */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">{t('fieldRoles')}</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    form.roles.includes(role)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-[#1a1a1a] text-zinc-400 border-[#2a2a2a] hover:border-zinc-500'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          {/* Şifre — sadece yeni kullanıcıda */}
          {!userId && (
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">{t('fieldPassword')}</Label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="bg-[#1a1a1a] border-[#2a2a2a]" />
            </div>
          )}
          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="border-[#2a2a2a]">{t('cancel')}</Button>
            <Button size="sm" onClick={handleSave}>{t('save')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Ana Sayfa ──────────────────────────────────────────────────────────────
export const Users = () => {
  const { users, deleteUser, toggleStatus } = useUserStore();
  const { t: tRaw } = useTranslation('users');
  const t = tRaw as unknown as (k: string) => string;

  const [tab, setTab] = useState<'users' | 'roles'>('users');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (roleFilter !== 'all' && !u.roles.includes(roleFilter)) return false;
      return true;
    });
  }, [users, search, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const goPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t('subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-0">
        {(['users', 'roles'] as const).map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
              tab === key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {key === 'users' ? t('tabUsers') : t('tabRoles')}
          </button>
        ))}
      </div>

      {tab === 'roles' ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
          <InfoIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">{t('rolesTabInfo')}</p>
        </div>
      ) : (
        <>
          {/* Filtre Barı */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('filterPlaceholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-9 bg-[#111] border-[#2a2a2a]"
              />
            </div>

            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v as any); setPage(1); }}>
              <SelectTrigger className="h-9 w-36 bg-[#111] border-[#2a2a2a] text-sm">
                <SelectValue placeholder={t('filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="active">{t('statusActive')}</SelectItem>
                <SelectItem value="inactive">{t('statusInactive')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={v => { setRoleFilter(v as any); setPage(1); }}>
              <SelectTrigger className="h-9 w-44 bg-[#111] border-[#2a2a2a] text-sm">
                <SelectValue placeholder={t('filterRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allRoles')}</SelectItem>
                {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" className="h-9 border-[#2a2a2a] gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {t('btnView')}
              </Button>
              <Button variant="outline" size="sm" className="h-9 border-[#2a2a2a] gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {t('btnInvite')}
              </Button>
              <Button size="sm" className="h-9 gap-1.5" onClick={() => setAddOpen(true)}>
                <UserPlus className="w-3.5 h-3.5" /> {t('btnAdd')}
              </Button>
            </div>
          </div>

          {/* Tablo */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/10 text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">{t('colName')}</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">{t('colPhone')}</th>
                  <th className="text-left px-5 py-3 font-medium">{t('colStatus')}</th>
                  <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">{t('colRole')}</th>
                  <th className="text-center px-5 py-3 font-medium">{t('colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">{t('noUsers')}</td>
                  </tr>
                ) : paginated.map(user => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-white/[0.03] transition-all duration-200">
                    {/* Ad */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(user.id)}`}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-100">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Telefon */}
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{user.phone}</td>
                    {/* Statü */}
                    <td className="px-5 py-3">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border cursor-pointer ${
                          user.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === 'active' ? t('statusActive') : t('statusInactive')}
                      </Badge>
                    </td>
                    {/* Roller */}
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(r => (
                          <Badge key={r} variant="secondary" className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 border-zinc-700">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    {/* İşlemler */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#1e1e1e] transition-all" title="Bilgi">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#1e1e1e] transition-all"
                          title="Düzenle"
                          onClick={() => setEditUser(user)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                          title="Kilitle"
                          onClick={() => toggleStatus(user.id)}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Sil"
                          onClick={() => { if (confirm(t('deleteConfirm'))) deleteUser(user.id); }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{t('rowsPerPage')}:</span>
              <Select value={String(rowsPerPage)} onValueChange={v => { setRowsPerPage(Number(v)); setPage(1); }}>
                <SelectTrigger className="h-7 w-16 bg-[#111] border-[#2a2a2a] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROWS_OPTIONS.map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <span>{t('page')} {page} {t('of')} {totalPages}</span>
              <button onClick={() => goPage(1)} disabled={page === 1} className="p-1 rounded hover:bg-[#1e1e1e] disabled:opacity-30 transition-all">
                <ChevronFirst className="w-4 h-4" />
              </button>
              <button onClick={() => goPage(page - 1)} disabled={page === 1} className="p-1 rounded hover:bg-[#1e1e1e] disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => goPage(page + 1)} disabled={page === totalPages} className="p-1 rounded hover:bg-[#1e1e1e] disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => goPage(totalPages)} disabled={page === totalPages} className="p-1 rounded hover:bg-[#1e1e1e] disabled:opacity-30 transition-all">
                <ChevronLast className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Modal */}
      <UserFormModal open={addOpen} onClose={() => setAddOpen(false)} />

      {/* Edit Modal */}
      {editUser && (
        <UserFormModal
          open={!!editUser}
          onClose={() => setEditUser(null)}
          userId={editUser.id}
          initial={{ name: editUser.name, email: editUser.email, phone: editUser.phone, roles: editUser.roles }}
        />
      )}
    </div>
  );
};
