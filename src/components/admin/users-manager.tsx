'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Mail,
  CreditCard,
  UserCheck,
  UserX,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  listAdminUsersAction,
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction,
  resetAdminUserPasswordAction,
  type AdminUserRecord,
} from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const ROLE_INFO: Record<
  AdminUserRecord['rol'],
  { label: string; desc: string; badgeClass: string; avatarBg: string }
> = {
  admin: {
    label: 'Administrador',
    desc: 'Acceso total al sistema, finanzas y configuración',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    avatarBg: 'bg-gradient-to-br from-rose-500/20 to-red-600/30 text-rose-700 dark:text-rose-300',
  },
  disenador: {
    label: 'Diseñador 3D / Renders',
    desc: 'Gestión de catálogos, despieces y modelos 3D',
    badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    avatarBg: 'bg-gradient-to-br from-purple-500/20 to-indigo-600/30 text-purple-700 dark:text-purple-300',
  },
  vendedor: {
    label: 'Asesor Comercial',
    desc: 'Gestión de leads, clientes y presupuestos',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    avatarBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/30 text-blue-700 dark:text-blue-300',
  },
  instalador: {
    label: 'Técnico de Instalación',
    desc: 'Supervisión en obra, entregas y montaje en campo',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    avatarBg: 'bg-gradient-to-br from-amber-500/20 to-orange-600/30 text-amber-700 dark:text-amber-300',
  },
  afiliado_vip: {
    label: 'Socio / Afiliado VIP',
    desc: 'Acceso a comisiones de gran escala y catálogo directo',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    avatarBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/30 text-emerald-700 dark:text-emerald-300',
  },
};

export function UsersManager() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal Crear Usuario
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<AdminUserRecord['rol']>('vendedor');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Modal Éxito con credenciales
  const [successData, setSuccessData] = useState<{ email: string; dni: string; rol: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Modal Editar Usuario
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [updating, setUpdating] = useState(false);

  // Feedback toast / notification
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const res = await listAdminUsersAction();
    if (res.success && res.users) {
      setUsers(res.users);
    } else {
      setNotice({ type: 'error', message: res.error || 'Error al cargar usuarios.' });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    const res = await createAdminUserAction({
      nombre,
      dni,
      email,
      rol,
    });

    if (res.success) {
      setSuccessData({ email: email.toLowerCase().trim(), dni: dni.trim(), rol: ROLE_INFO[rol].label });
      setCreateModalOpen(false);
      setNombre('');
      setDni('');
      setEmail('');
      setRol('vendedor');
      loadUsers();
    } else {
      setCreateError(res.error || 'No se pudo crear el usuario.');
    }
    setCreating(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUpdating(true);

    const res = await updateAdminUserAction({
      email: editingUser.email,
      nombre: editingUser.nombre,
      dni: editingUser.dni,
      rol: editingUser.rol,
      activo: editingUser.activo,
    });

    if (res.success) {
      setEditModalOpen(false);
      setEditingUser(null);
      setNotice({ type: 'success', message: 'Usuario actualizado exitosamente.' });
      loadUsers();
    } else {
      setNotice({ type: 'error', message: res.error || 'Error al actualizar.' });
    }
    setUpdating(false);
  };

  const handleDeleteUser = async (userEmail: string) => {
    if (!confirm(`¿Estás seguro de eliminar el acceso para ${userEmail}? Esta acción no se puede deshacer.`)) {
      return;
    }
    const res = await deleteAdminUserAction(userEmail);
    if (res.success) {
      setNotice({ type: 'success', message: `Usuario ${userEmail} eliminado.` });
      loadUsers();
    } else {
      setNotice({ type: 'error', message: res.error || 'Error al eliminar usuario.' });
    }
  };

  const handleResetPassword = async (userEmail: string) => {
    if (!confirm(`¿Restablecer la contraseña de ${userEmail} a su número de cédula? El usuario deberá cambiarla al iniciar sesión.`)) {
      return;
    }
    const res = await resetAdminUserPasswordAction(userEmail);
    if (res.success) {
      setNotice({ type: 'success', message: res.message || 'Contraseña restablecida.' });
      loadUsers();
    } else {
      setNotice({ type: 'error', message: res.error || 'Error al restablecer.' });
    }
  };

  const handleToggleActive = async (user: AdminUserRecord) => {
    const res = await updateAdminUserAction({
      email: user.email,
      nombre: user.nombre,
      dni: user.dni,
      rol: user.rol,
      activo: !user.activo,
    });
    if (res.success) {
      setNotice({ type: 'success', message: `Usuario ${!user.activo ? 'activado' : 'desactivado'}.` });
      loadUsers();
    }
  };

  const copyCredentials = () => {
    if (!successData) return;
    const text = `Credenciales de Acceso Modulares GM:\nCorreo: ${successData.email}\nContraseña temporal (Cédula): ${successData.dni}\nRol: ${successData.rol}\nEnlace de ingreso: https://www.modularesgm.com/admin`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filtrado
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.dni.includes(search);
    const matchesRole = roleFilter === 'all' || u.rol === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Apple Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.2em] text-stone-800 dark:text-stone-300 mb-2">
            <Shield size={13} className="text-primary" />
            <span>Control de Accesos & Seguridad</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-stone-950 dark:text-white tracking-tight">
            Directorio de Usuarios & Roles
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Gestión centralizada del equipo GM. Los usuarios creados ingresan por primera vez con su cédula y el sistema les exige cambio de clave inmediato.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="h-11 px-5 rounded-2xl bg-stone-900 text-white dark:bg-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-100 font-bold shadow-lg shadow-black/5 dark:shadow-white/5 gap-2 transition-all active:scale-95 shrink-0"
        >
          <UserPlus size={16} />
          <span>Añadir Usuario</span>
        </Button>
      </div>

      {/* Banner de Aviso temporal */}
      {notice && (
        <div
          className={cn(
            'flex items-center justify-between p-4 rounded-2xl border text-sm font-medium animate-in slide-in-from-top-2 duration-300',
            notice.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20'
          )}
        >
          <div className="flex items-center gap-3">
            {notice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-xs uppercase font-bold tracking-wider hover:opacity-75 transition-opacity"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Métricas rápidas estilo Apple Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl shadow-sm">
          <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Total Usuarios</p>
          <p className="text-3xl font-extrabold text-stone-950 dark:text-white mt-2 font-headline">{users.length}</p>
          <p className="text-[11px] text-stone-500 mt-1">Registrados en la plataforma</p>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl shadow-sm">
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Administradores</p>
          <p className="text-3xl font-extrabold text-stone-950 dark:text-white mt-2 font-headline">
            {users.filter((u) => u.rol === 'admin').length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Permiso total de control</p>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl shadow-sm">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Ventas & Diseño</p>
          <p className="text-3xl font-extrabold text-stone-950 dark:text-white mt-2 font-headline">
            {users.filter((u) => u.rol === 'vendedor' || u.rol === 'disenador').length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Atención comercial y 3D</p>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl shadow-sm">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Primer Ingreso</p>
          <p className="text-3xl font-extrabold text-stone-950 dark:text-white mt-2 font-headline">
            {users.filter((u) => u.primerIngreso).length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Pendiente cambio de clave</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o cédula..."
            className="pl-10 h-10 rounded-2xl border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 text-sm shadow-sm"
          />
        </div>

        {/* Segmented Control / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'admin', label: 'Admin' },
            { id: 'vendedor', label: 'Ventas' },
            { id: 'disenador', label: 'Diseño 3D' },
            { id: 'instalador', label: 'Técnicos' },
            { id: 'afiliado_vip', label: 'VIP' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95',
                roleFilter === tab.id
                  ? 'bg-stone-950 text-white dark:bg-white dark:text-stone-950 shadow-sm'
                  : 'bg-stone-200/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Usuarios */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 font-medium">Cargando directorio de usuarios...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 text-center">
          <Users size={36} className="mx-auto text-stone-400 mb-3" />
          <h3 className="text-base font-bold text-stone-900 dark:text-white">No se encontraron usuarios</h3>
          <p className="text-xs text-stone-500 mt-1">Prueba con otro término de búsqueda o añade un nuevo usuario.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => {
            const roleMeta = ROLE_INFO[user.rol] || ROLE_INFO.vendedor;
            const initials = user.nombre
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={user.id}
                className={cn(
                  'group relative flex flex-col justify-between p-6 rounded-3xl border bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700',
                  user.activo ? 'border-stone-200/80 dark:border-stone-800/80' : 'border-stone-200/40 opacity-70'
                )}
              >
                <div>
                  {/* Encabezado de Tarjeta con Avatar y Estado */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0',
                          roleMeta.avatarBg
                        )}
                      >
                        {initials || 'GM'}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-stone-950 dark:text-white leading-tight">
                          {user.nombre}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5 font-medium">
                          <CreditCard size={12} />
                          <span>Cédula: {user.dni}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleActive(user)}
                      title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 active:scale-95',
                        user.activo
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-stone-500/10 text-stone-500 border-stone-500/20'
                      )}
                    >
                      <span className={cn('w-1.5 h-1.5 rounded-full', user.activo ? 'bg-emerald-500' : 'bg-stone-400')} />
                      <span>{user.activo ? 'Activo' : 'Inactivo'}</span>
                    </button>
                  </div>

                  {/* Correo Electrónico */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100/70 dark:bg-stone-800/50 px-3 py-2 rounded-xl mb-4">
                    <Mail size={13} className="text-stone-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {/* Rol y Badges */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Rol Asignado:</span>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-bold border', roleMeta.badgeClass)}>
                        {roleMeta.label}
                      </span>
                    </div>

                    {user.primerIngreso ? (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-stone-500 font-medium">Seguridad:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Lock size={10} />
                          <span>Pendiente 1er cambio</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-stone-500 font-medium">Seguridad:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>Clave definitiva activa</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="pt-4 border-t border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingUser(user);
                      setEditModalOpen(true);
                    }}
                    className="h-8 rounded-xl text-xs font-semibold px-3 border-stone-300 dark:border-stone-700 gap-1.5 active:scale-95"
                  >
                    <Edit2 size={12} />
                    <span>Editar</span>
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetPassword(user.email)}
                      title="Restablecer contraseña a la Cédula"
                      className="h-8 w-8 p-0 rounded-xl text-stone-600 dark:text-stone-400 hover:text-amber-600 hover:bg-amber-500/10"
                    >
                      <RefreshCw size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.email)}
                      title="Eliminar usuario"
                      className="h-8 w-8 p-0 rounded-xl text-stone-600 dark:text-stone-400 hover:text-rose-600 hover:bg-rose-500/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Crear Usuario */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-headline font-bold text-stone-950 dark:text-white flex items-center gap-2">
              <UserPlus size={20} className="text-primary" />
              <span>Añadir Nuevo Usuario</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 dark:text-stone-400">
              Registra un miembro del equipo. Su contraseña inicial será su cédula y se le solicitará actualizarla en su primer inicio de sesión.
            </DialogDescription>
          </DialogHeader>

          {createError && (
            <div className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300">Nombre Completo</Label>
              <Input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Roberto Morales"
                className="h-11 rounded-xl text-sm border-stone-300 dark:border-stone-700"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-stone-700 dark:text-stone-300">Cédula / DNI</Label>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Clave inicial</span>
              </div>
              <Input
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="1712345678"
                minLength={6}
                className="h-11 rounded-xl text-sm border-stone-300 dark:border-stone-700 font-mono"
              />
              <p className="text-[11px] text-stone-500">Mínimo 6 caracteres para autenticación segura en Firebase.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300">Correo Electrónico</Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@modularesgm.com"
                className="h-11 rounded-xl text-sm border-stone-300 dark:border-stone-700"
              />
            </div>

            {/* Selector de Rol Compacto en Lista Desplegable (Garantiza visibilidad del botón Guardar) */}
            <div className="space-y-1.5">
              <Label htmlFor="create-user-role-select" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Rol del Usuario
              </Label>
              <select
                id="create-user-role-select"
                value={rol}
                onChange={(e) => setRol(e.target.value as AdminUserRecord['rol'])}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-xs"
              >
                {(Object.keys(ROLE_INFO) as AdminUserRecord['rol'][]).map((rKey) => (
                  <option key={rKey} value={rKey} className="py-2 bg-white dark:bg-stone-800 text-stone-900 dark:text-white">
                    {ROLE_INFO[rKey].label} ({ROLE_INFO[rKey].desc})
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-4 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-xl h-11 text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="rounded-xl h-11 bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold text-xs shadow-md active:scale-95"
              >
                {creating ? 'Creando en Firebase...' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Éxito de Creación con Credenciales para Copiar */}
      <Dialog open={!!successData} onOpenChange={() => setSuccessData(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl p-6 sm:p-8">
          <DialogHeader className="text-center sm:text-center">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 size={28} />
            </div>
            <DialogTitle className="text-xl font-headline font-bold text-stone-950 dark:text-white">
              ¡Usuario Creado Exitosamente!
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Comparte las siguientes credenciales con el nuevo miembro del equipo:
            </DialogDescription>
          </DialogHeader>

          {successData && (
            <div className="space-y-3 py-3">
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Usuario / Correo:</span>
                  <strong className="text-stone-900 dark:text-white">{successData.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Clave Inicial (Cédula):</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{successData.dni}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Rol:</span>
                  <strong className="text-stone-900 dark:text-white font-sans">{successData.rol}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">URL del Panel:</span>
                  <span className="text-primary underline">https://www.modularesgm.com/admin</span>
                </div>
              </div>

              <Button
                onClick={copyCredentials}
                variant="outline"
                className="w-full h-11 rounded-2xl border-stone-300 dark:border-stone-700 text-xs font-bold gap-2 active:scale-95"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Credenciales para Enviar'}</span>
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setSuccessData(null)}
              className="w-full h-11 rounded-2xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs font-bold"
            >
              Listo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Usuario */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-headline font-bold text-stone-950 dark:text-white flex items-center gap-2">
              <Edit2 size={20} className="text-primary" />
              <span>Editar Usuario</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Modifica la información o el rol del usuario {editingUser?.email}.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-700 dark:text-stone-300">Nombre Completo</Label>
                <Input
                  required
                  value={editingUser.nombre}
                  onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                  className="h-11 rounded-xl text-sm border-stone-300 dark:border-stone-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-700 dark:text-stone-300">Cédula / DNI</Label>
                <Input
                  required
                  value={editingUser.dni}
                  onChange={(e) => setEditingUser({ ...editingUser, dni: e.target.value })}
                  className="h-11 rounded-xl text-sm border-stone-300 dark:border-stone-700 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-700 dark:text-stone-300">Rol</Label>
                <select
                  value={editingUser.rol}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, rol: e.target.value as AdminUserRecord['rol'] })
                  }
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-semibold"
                >
                  {(Object.keys(ROLE_INFO) as AdminUserRecord['rol'][]).map((rKey) => (
                    <option key={rKey} value={rKey}>
                      {ROLE_INFO[rKey].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
                <span className="text-xs font-bold text-stone-900 dark:text-white">Estado de la cuenta</span>
                <button
                  type="button"
                  onClick={() => setEditingUser({ ...editingUser, activo: !editingUser.activo })}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold transition-colors active:scale-95',
                    editingUser.activo
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-stone-400/20 text-stone-500'
                  )}
                >
                  {editingUser.activo ? 'Activo' : 'Inactivo'}
                </button>
              </div>

              <DialogFooter className="pt-4 flex sm:justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl h-11 text-xs font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl h-11 bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold text-xs shadow-md active:scale-95"
                >
                  {updating ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
