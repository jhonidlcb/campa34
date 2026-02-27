import { useQuery, useMutation } from "@tanstack/react-query";
import { type Supporter, type Activity, type News, type Proposal, type HomeContent } from "@shared/schema";
import { Trash2, Upload, Pencil, Search, Filter, TrendingUp, UserCheck, UserMinus, Users as UsersIcon, Home } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, LogOut, Download, Users, Calendar, Newspaper, Lightbulb, Plus, Palette, Settings, Flag, Image, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertActivitySchema, insertNewsSchema, insertProposalSchema, insertHomeContentSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function Admin() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "colorado");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNeighborhood, setFilterNeighborhood] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const { data: homeContent } = useQuery<HomeContent>({
    queryKey: ["/api/home-content"],
  });

  const { data: supporters, isLoading: loadingSupporters } = useQuery<Supporter[]>({
    queryKey: ["/api/supporters"],
  });

  const { data: activities, isLoading: loadingActivities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: news, isLoading: loadingNews } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });

  const updateHomeContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/home-content", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-content"] });
      toast({ title: "Éxito", description: "Contenido actualizado" });
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/activities", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Éxito", description: "Actividad creada correctamente" });
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/news", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Éxito", description: "Noticia publicada correctamente" });
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/proposals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast({ title: "Éxito", description: "Propuesta añadida correctamente" });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PATCH", `/api/activities/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Éxito", description: "Actividad actualizada" });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PATCH", `/api/news/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Éxito", description: "Noticia actualizada" });
    },
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PATCH", `/api/proposals/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast({ title: "Éxito", description: "Propuesta actualizada" });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Éxito", description: "Actividad eliminada" });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Éxito", description: "Noticia eliminada" });
    },
  });

  const deleteProposalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/proposals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast({ title: "Éxito", description: "Propuesta eliminada" });
    },
  });

  const homeForm = useForm({
    resolver: zodResolver(insertHomeContentSchema),
    values: homeContent ? {
      heroTitle: homeContent.heroTitle,
      heroSubtitle: homeContent.heroSubtitle,
      heroImage: homeContent.heroImage || "",
      allianceName: homeContent.allianceName || "ALIANZA POR EL CAMBIO",
      allianceMovement: homeContent.allianceMovement || "ALIANZA POR EL PROGRESO 2026",
      candidateName: homeContent.candidateName || "Candidato Lista 1",
      candidateRole: homeContent.candidateRole || "Opción a Concejal Municipal",
      candidateImage: homeContent.candidateImage || "",
      candidateListNumber: homeContent.candidateListNumber || "AL",
      theme: homeContent.theme || "colorado",
      transparencyText: homeContent.transparencyText || "Publicaremos informes trimestrales de gestión accesibles a todos los vecinos.",
    } : { 
      heroTitle: "", 
      heroSubtitle: "", 
      heroImage: "",
      allianceName: "",
      allianceMovement: "",
      candidateName: "",
      candidateRole: "",
      candidateImage: "",
      candidateListNumber: "AL",
      theme: "colorado",
      transparencyText: "Publicaremos informes trimestrales de gestión accesibles a todos los vecinos.",
    },
  });

  const activityForm = useForm({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: { title: "", description: "", date: new Date().toISOString().split("T")[0], imageUrl: "" },
  });

  const newsForm = useForm({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: { title: "", content: "", imageUrl: "" },
  });

  const proposalForm = useForm({
    resolver: zodResolver(insertProposalSchema),
    defaultValues: { title: "", problem: "", solution: "", category: "Salud" },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      callback(url);
      toast({ title: "Éxito", description: "Imagen subida correctamente" });
    } catch (err) {
      toast({ title: "Error", description: "Error al subir imagen", variant: "destructive" });
    }
  };

  const exportToExcel = () => {
    if (!supporters) return;
    const headers = "Nombre,Barrio,Tipo de Zona,Teléfono,Cédula,Edad,Familia,Mensaje,Fecha\n";
    const csvContent = "data:text/csv;charset=utf-8," + 
      headers + 
      supporters.map(s => `"${s.name}","${s.neighborhood}","${s.neighborhoodType}","${s.phone}","${s.cedula}","${s.ageRange}","${s.familySize}","${(s.message || "").replace(/"/g, '""')}","${s.createdAt}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `simpatizantes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    if (!supporters) return null;

    const byNeighborhood: Record<string, number> = {};
    let over18 = 0;
    let under18 = 0;
    let totalFamilySize = 0;
    let familyCount = 0;

    supporters.forEach(s => {
      // Neighborhood stats
      byNeighborhood[s.neighborhood] = (byNeighborhood[s.neighborhood] || 0) + 1;
      
      // Age stats
      if (s.ageRange === "16–17") {
        under18++;
      } else {
        over18++;
      }

      // Family size stats
      const sizeMap: Record<string, number> = { "1–2": 1.5, "3–4": 3.5, "5–6": 5.5, "7+": 8 };
      if (s.familySize && sizeMap[s.familySize]) {
        totalFamilySize += sizeMap[s.familySize];
        familyCount++;
      }
    });

    const neighborhoodData = Object.entries(byNeighborhood)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      neighborhoodData,
      over18,
      under18,
      avgFamilySize: familyCount > 0 ? (totalFamilySize / familyCount).toFixed(1) : 0,
      topNeighborhoods: neighborhoodData.slice(0, 5)
    };
  }, [supporters]);

  const filteredSupporters = useMemo(() => {
    if (!supporters) return [];
    return supporters.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.phone.includes(searchTerm);
      const matchesNeighborhood = filterNeighborhood === "all" || s.neighborhood === filterNeighborhood;
      const matchesAge = filterAge === "all" || s.ageRange === filterAge;
      return matchesSearch && matchesNeighborhood && matchesAge;
    });
  }, [supporters, searchTerm, filterNeighborhood, filterAge]);

  const uniqueNeighborhoods = useMemo(() => {
    if (!supporters) return [];
    return Array.from(new Set(supporters.map(s => s.neighborhood))).filter(Boolean).sort();
  }, [supporters]);

  if (loadingSupporters || loadingActivities || loadingNews || loadingProposals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">Electoral Pro</h1>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-2 border-none">
              {[
                { id: 'overview', label: 'Panel General', icon: Home },
                { id: 'supporters', label: 'Simpatizantes', icon: UsersIcon },
                { id: 'content', label: 'Gestión Contenido', icon: Newspaper },
                { id: 'settings', label: 'Configuración', icon: Settings },
              ].map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex items-center justify-start gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-white group data-[state=active]:bg-blue-600 data-[state=active]:text-white border-none shadow-none text-slate-300 font-medium"
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </nav>

          <div className="p-4 mt-auto border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Usuario</p>
              <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => logoutMutation.mutate()} 
              className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
            >
              <LogOut className="h-5 w-5 mr-3" /> Salir del Sistema
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
            <h2 className="text-xl font-bold text-slate-800">Panel de Control Electoral</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <Palette className="h-4 w-4 text-slate-400" />
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0 w-[140px] h-auto p-0 text-sm font-medium">
                    <SelectValue placeholder="Estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colorado">Colorado (Rojo)</SelectItem>
                    <SelectItem value="alianza">Alianza (Naranja)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">

            <TabsContent value="overview" className="mt-0 space-y-8">
              {/* Existing modernized statistics section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden group">
                <CardContent className="p-7">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Simpatizantes</p>
                      <h3 className="text-4xl font-black text-slate-900 leading-none">{supporters?.length || 0}</h3>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                      <Users className="h-7 w-7 text-blue-600 group-hover:text-white"/>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-sm">
                    <div className="flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg font-bold">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" /> +12%
                    </div>
                    <span className="text-slate-400 ml-3 font-medium">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden group">
                <CardContent className="p-7">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Habilitados (+18)</p>
                      <h3 className="text-4xl font-black text-slate-900 leading-none">{stats?.over18 || 0}</h3>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 transition-colors duration-300">
                      <UserCheck className="h-7 w-7 text-emerald-600 group-hover:text-white"/>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase">Padrón potencial</p>
                      <p className="text-xs font-black text-emerald-600">{supporters?.length ? Math.round((stats?.over18 || 0) / supporters.length * 100) : 0}%</p>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${supporters?.length ? ((stats?.over18 || 0) / supporters.length * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden group">
                <CardContent className="p-7">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Futuros Votantes</p>
                      <h3 className="text-4xl font-black text-slate-900 leading-none">{stats?.under18 || 0}</h3>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-600 transition-colors duration-300">
                      <UserMinus className="h-7 w-7 text-orange-600 group-hover:text-white"/>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                      Jóvenes de 16-17 años identificados para seguimiento territorial.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-none rounded-2xl overflow-hidden group">
                <CardContent className="p-7">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alcance Familiar</p>
                      <h3 className="text-4xl font-black text-slate-900 leading-none">{stats?.avgFamilySize || 0}</h3>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-600 transition-colors duration-300">
                      <Home className="h-7 w-7 text-purple-600 group-hover:text-white"/>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center p-3 bg-slate-50 rounded-xl">
                    <UsersIcon className="h-4 w-4 mr-2 text-purple-400" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Promedio personas / hogar</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <Card className="lg:col-span-2 bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-50 p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Distribución Territorial</CardTitle>
                      <CardDescription className="text-slate-500 font-medium">Simpatizantes segmentados por barrios clave</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-7">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={stats?.neighborhoodData || []} 
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                        barSize={45}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          interval={0} 
                          height={80} 
                          tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}}
                          axisLine={{stroke: '#f1f5f9'}}
                        />
                        <YAxis 
                          tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            padding: '16px',
                            fontWeight: 'bold'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#3b82f6" 
                          radius={[8, 8, 0, 0]}
                          animationDuration={1500}
                          label={{ position: 'top', fill: '#64748b', fontSize: 12, fontWeight: 'bold', offset: 10 }}
                        >
                          {(stats?.neighborhoodData || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-8">
                <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-slate-50 p-7">
                    <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Composición Edad</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Segmentación por rango etario</CardDescription>
                  </CardHeader>
                  <CardContent className="p-7">
                    <div className="h-[300px] w-full flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Habilitados (+18)', value: stats?.over18 || 0 },
                              { name: 'Menores (16-17)', value: stats?.under18 || 0 }
                            ]}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={8}
                            dataKey="value"
                            animationDuration={1500}
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '16px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                              padding: '12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-900">{supporters?.length || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                      </div>
                    </div>
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-bold text-slate-700">Habilitados</span>
                        </div>
                        <span className="text-sm font-black text-emerald-700">{Math.round(((stats?.over18 || 0) / (supporters?.length || 1)) * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          <span className="text-sm font-bold text-slate-700">Futuros Votantes</span>
                        </div>
                        <span className="text-sm font-black text-orange-700">{Math.round(((stats?.under18 || 0) / (supporters?.length || 1)) * 100)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-slate-50 p-7">
                    <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Top Barrios</CardTitle>
                  </CardHeader>
                  <CardContent className="p-7">
                    <div className="space-y-4">
                      {stats?.topNeighborhoods.map((n, i) => (
                        <div key={n.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              i === 0 ? 'bg-yellow-400 text-white shadow-sm' : 
                              i === 1 ? 'bg-slate-300 text-white shadow-sm' : 
                              i === 2 ? 'bg-amber-600 text-white shadow-sm' : 
                              'bg-slate-100 text-slate-400'
                            }`}>{i + 1}</span>
                            <span className="font-bold text-slate-700">{n.name}</span>
                          </div>
                          <span className="text-sm font-black text-slate-900">{n.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            </TabsContent>

            <TabsContent value="supporters" className="mt-0">
              <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-3xl font-black text-slate-900">Base de Simpatizantes</CardTitle>
                      <CardDescription className="text-lg font-medium text-slate-500">Gestiona y analiza el crecimiento de tu base electoral.</CardDescription>
                    </div>
                    <Button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">
                      <Download className="mr-2 h-5 w-5" /> Exportar a CSV
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        placeholder="Buscar por nombre, barrio o celular..." 
                        className="pl-12 h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterNeighborhood} onValueChange={setFilterNeighborhood}>
                      <SelectTrigger className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white font-medium">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Todos los Barrios" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los Barrios</SelectItem>
                        {uniqueNeighborhoods.map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterAge} onValueChange={setFilterAge}>
                      <SelectTrigger className="h-14 bg-slate-50 border-transparent rounded-xl focus:bg-white font-medium">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Rango de Edad" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las Edades</SelectItem>
                        <SelectItem value="16–17">16–17 (Futuros Votantes)</SelectItem>
                        <SelectItem value="18–25">18–25</SelectItem>
                        <SelectItem value="26–40">26–40</SelectItem>
                        <SelectItem value="41–60">41–60</SelectItem>
                        <SelectItem value="60+">60+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none">
                          <TableHead className="font-bold text-slate-500 py-5 pl-8">Nombre</TableHead>
                          <TableHead className="font-bold text-slate-500">Barrio / Zona</TableHead>
                          <TableHead className="font-bold text-slate-500">Celular</TableHead>
                          <TableHead className="font-bold text-slate-500">Cédula</TableHead>
                          <TableHead className="font-bold text-slate-500">Edad</TableHead>
                          <TableHead className="font-bold text-slate-500">Familia</TableHead>
                          <TableHead className="font-bold text-slate-500 pr-8">Fecha Registro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSupporters.map((s) => (
                          <TableRow key={s.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                            <TableCell className="font-black text-slate-900 py-5 pl-8">{s.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{s.neighborhood}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{s.neighborhoodType}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-blue-600">{s.phone}</TableCell>
                            <TableCell className="font-medium text-slate-500">{s.cedula || '—'}</TableCell>
                            <TableCell>
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                                s.ageRange === '16–17' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {s.ageRange}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-slate-600">{s.familySize ? `${s.familySize} pers.` : '—'}</TableCell>
                            <TableCell className="text-slate-400 font-medium pr-8">{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* News & Activities */}
                <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl font-black">Noticias & Prensa</CardTitle>
                        <CardDescription className="text-slate-400 text-lg">Publica actualizaciones de tu campaña.</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl font-bold shadow-xl shadow-blue-900/20"><Plus className="h-5 w-5 mr-2"/> Nueva Noticia</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-2xl">
                          <DialogHeader className="p-2">
                            <DialogTitle className="text-2xl font-black">Redactar Noticia</DialogTitle>
                          </DialogHeader>
                          <div className="p-2">
                            <Form {...newsForm}><form onSubmit={newsForm.handleSubmit(data => createNewsMutation.mutate(data))} className="space-y-6">
                              <FormField control={newsForm.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">Título</FormLabel><FormControl><Input {...field} className="rounded-xl h-12"/></FormControl></FormItem>
                              )}/>
                              <FormField control={newsForm.control} name="content" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">Contenido</FormLabel><FormControl><Textarea {...field} className="rounded-xl min-h-[150px]"/></FormControl></FormItem>
                              )}/>
                              <FormField control={newsForm.control} name="imageUrl" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">Imagen</FormLabel><FormControl>
                                  <div className="flex gap-2">
                                    <Input {...field} className="rounded-xl h-12" placeholder="URL o sube archivo" />
                                    <Input type="file" className="hidden" id="news-upload" onChange={(e) => handleFileUpload(e, (url) => newsForm.setValue("imageUrl", url))} />
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('news-upload')?.click()} className="h-12 w-12 rounded-xl"><Upload className="h-5 w-5"/></Button>
                                  </div>
                                </FormControl></FormItem>
                              )}/>
                              <Button type="submit" className="w-full h-14 bg-slate-900 text-white font-black text-lg rounded-xl" disabled={createNewsMutation.isPending}>
                                {createNewsMutation.isPending ? <Loader2 className="animate-spin" /> : "Publicar Noticia"}
                              </Button>
                            </form></Form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-7">
                    <div className="space-y-4">
                      {news?.map(n => (
                        <div key={n.id} className="group p-4 bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-2xl border border-transparent hover:border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200">
                              {n.imageUrl ? (
                                <img src={n.imageUrl} alt="" className="w-full h-full object-cover"/>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><Newspaper className="h-6 w-6"/></div>
                              )}
                            </div>
                            <div className="max-w-[200px] md:max-w-[300px]">
                              <h4 className="font-black text-slate-900 truncate">{n.title}</h4>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{new Date(n.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100" onClick={() => deleteNewsMutation.mutate(n.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activities */}
                <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl font-black">Agenda Territorial</CardTitle>
                        <CardDescription className="text-slate-400 text-lg">Actividades y eventos programados.</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-xl font-bold shadow-xl shadow-emerald-900/20"><Plus className="h-5 w-5 mr-2"/> Nueva Actividad</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-2xl">
                          <DialogHeader className="p-2"><DialogTitle className="text-2xl font-black">Programar Actividad</DialogTitle></DialogHeader>
                          <div className="p-2">
                            <Form {...activityForm}><form onSubmit={activityForm.handleSubmit(data => createActivityMutation.mutate(data))} className="space-y-6">
                              <FormField control={activityForm.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">Título</FormLabel><FormControl><Input {...field} className="rounded-xl h-12"/></FormControl></FormItem>
                              )}/>
                              <FormField control={activityForm.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">Descripción</FormLabel><FormControl><Textarea {...field} className="rounded-xl min-h-[100px]"/></FormControl></FormItem>
                              )}/>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField control={activityForm.control} name="date" render={({ field }) => (
                                  <FormItem><FormLabel className="font-bold">Fecha</FormLabel><FormControl><Input type="date" {...field} className="rounded-xl h-12"/></FormControl></FormItem>
                                )}/>
                                <FormField control={activityForm.control} name="imageUrl" render={({ field }) => (
                                  <FormItem><FormLabel className="font-bold">Imagen (URL)</FormLabel><FormControl><Input {...field} className="rounded-xl h-12"/></FormControl></FormItem>
                                )}/>
                              </div>
                              <Button type="submit" className="w-full h-14 bg-slate-900 text-white font-black text-lg rounded-xl" disabled={createActivityMutation.isPending}>
                                {createActivityMutation.isPending ? <Loader2 className="animate-spin" /> : "Crear Actividad"}
                              </Button>
                            </form></Form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-7">
                    <div className="space-y-4">
                      {activities?.map(a => (
                        <div key={a.id} className="group p-4 bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-2xl border border-transparent hover:border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200">
                              {a.imageUrl ? (
                                <img src={a.imageUrl} alt="" className="w-full h-full object-cover"/>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><Calendar className="h-6 w-6"/></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900">{a.title}</h4>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{new Date(a.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-red-600 hover:bg-red-50 border-red-100" onClick={() => deleteActivityMutation.mutate(a.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Proposals */}
                <Card className="xl:col-span-2 bg-white shadow-xl border-none rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl font-black">Plan de Gobierno</CardTitle>
                        <CardDescription className="text-slate-400 text-lg">Define tus propuestas por categorías.</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-6 rounded-xl font-bold shadow-xl shadow-purple-900/20"><Plus className="h-5 w-5 mr-2"/> Nueva Propuesta</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-2xl">
                          <DialogHeader className="p-2"><DialogTitle className="text-2xl font-black">Nueva Propuesta</DialogTitle></DialogHeader>
                          <div className="p-2">
                            <Form {...proposalForm}><form onSubmit={proposalForm.handleSubmit(data => createProposalMutation.mutate(data))} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={proposalForm.control} name="title" render={({ field }) => (
                                  <FormItem><FormLabel className="font-bold">Título</FormLabel><FormControl><Input {...field} className="rounded-xl h-12"/></FormControl></FormItem>
                                )}/>
                                <FormField control={proposalForm.control} name="category" render={({ field }) => (
                                  <FormItem><FormLabel className="font-bold">Categoría</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Categoría" /></SelectTrigger></FormControl>
                                      <SelectContent><SelectItem value="Salud">Salud</SelectItem><SelectItem value="Educación">Educación</SelectItem><SelectItem value="Seguridad">Seguridad</SelectItem><SelectItem value="Infraestructura">Infraestructura</SelectItem></SelectContent>
                                    </Select>
                                  </FormItem>
                                )}/>
                              </div>
                              <FormField control={proposalForm.control} name="problem" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">El Problema</FormLabel><FormControl><Textarea {...field} className="rounded-xl min-h-[100px]"/></FormControl></FormItem>
                              )}/>
                              <FormField control={proposalForm.control} name="solution" render={({ field }) => (
                                <FormItem><FormLabel className="font-bold">Nuestra Solución</FormLabel><FormControl><Textarea {...field} className="rounded-xl min-h-[100px]"/></FormControl></FormItem>
                              )}/>
                              <Button type="submit" className="w-full h-14 bg-slate-900 text-white font-black text-lg rounded-xl" disabled={createProposalMutation.isPending}>
                                {createProposalMutation.isPending ? <Loader2 className="animate-spin" /> : "Guardar Propuesta"}
                              </Button>
                            </form></Form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {proposals?.map(p => (
                        <div key={p.id} className="group p-5 bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 rounded-2xl border border-transparent hover:border-slate-100">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black uppercase rounded-lg tracking-widest">{p.category}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => deleteProposalMutation.mutate(p.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 mb-2">{p.title}</h4>
                          <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{p.solution}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden max-w-4xl mx-auto">
                <CardHeader className="bg-slate-900 p-8 text-white">
                  <CardTitle className="text-3xl font-black">Ajustes del Sitio Web</CardTitle>
                  <CardDescription className="text-slate-400 text-lg">Personaliza la identidad visual y el contenido principal de tu campaña.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...homeForm}>
                    <form onSubmit={homeForm.handleSubmit(data => updateHomeContentMutation.mutate(data))} className="space-y-10">
                      <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                          <Palette className="h-5 w-5 text-blue-600" />
                          <h3 className="text-xl font-black text-slate-800">Sección Hero Principal</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={homeForm.control}
                            name="heroTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold text-slate-700">Título de Impacto</FormLabel>
                                <FormControl><Input {...field} className="rounded-xl h-12 text-lg font-bold border-slate-200" /></FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={homeForm.control}
                            name="heroSubtitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold text-slate-700">Subtítulo Descriptivo</FormLabel>
                                <FormControl><Textarea {...field} className="rounded-xl min-h-[100px] border-slate-200" /></FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </section>

                      <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                          <Flag className="h-5 w-5 text-emerald-600" />
                          <h3 className="text-xl font-black text-slate-800">Identidad Política</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={homeForm.control}
                            name="allianceName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold text-slate-700">Nombre del Partido</FormLabel>
                                <FormControl><Input {...field} className="rounded-xl h-12 border-slate-200" /></FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={homeForm.control}
                            name="allianceMovement"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold text-slate-700">Movimiento o Alianza</FormLabel>
                                <FormControl><Input {...field} className="rounded-xl h-12 border-slate-200" /></FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </section>

                      <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                          <Image className="h-5 w-5 text-orange-600" />
                          <h3 className="text-xl font-black text-slate-800">Multimedia</h3>
                        </div>
                        <FormField
                          control={homeForm.control}
                          name="heroImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-slate-700">Imagen Hero (Fondo)</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  <Input {...field} placeholder="URL de la imagen" className="rounded-xl border-slate-200" />
                                  <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-blue-400 transition-colors">
                                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    <p className="text-sm font-bold text-slate-500">Haz clic o arrastra para subir una nueva imagen</p>
                                    <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => homeForm.setValue("heroImage", url))} />
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </section>

                      <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white text-lg font-black rounded-2xl shadow-2xl transition-all active:scale-[0.98]" disabled={updateHomeContentMutation.isPending}>
                        {updateHomeContentMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                        Guardar Configuración Global
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </main>
        </div>
      </div>
    </Tabs>
  );
}
