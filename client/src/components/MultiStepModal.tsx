import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSupporterSchema, type InsertSupporter } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const ZONAS = {
  "Barrio": [
    "7 de Agosto", "Alegre", "Caacupemi", "Defensores del Chaco", "El Progreso",
    "Maestro Fermín López", "Maestro Fermín López Sub-Urbano", "Niño Jesús",
    "Residencial", "San Antonio de Padua", "San Francisco", "San Isidro",
    "San Isidro 2", "San Lorenzo", "San Lorenzo Sub-Urbano", "San Pedro",
    "San Roque", "San Valentín", "Santa Librada", "Tirol", "Virgen del Carmen"
  ],
  "Compañía / Localidad": [
    "Cruce Kimex", "Kressburgo", "Kressburgo Sub-Urbano", "Puerto López"
  ],
  "Asentamiento": [
    "Asentamiento Guarapay", "Asentamiento Palmital", "Asentamiento Santa Catalina 7 de Agosto"
  ],
  "Comunidad Indígena": [
    "Comunidad Indígena Arasa Poty", "Comunidad Indígena Kressburgo",
    "Comunidad Indígena Macutinga", "Comunidad Indígena Y’aka Marangatu"
  ]
};

const FAMILY_SIZES = ["1–2", "3–4", "5–6", "7+"];
const AGE_RANGES = ["16–17", "18–25", "26–40", "41–60", "60+"];

interface MultiStepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MultiStepModal({ open, onOpenChange }: MultiStepModalProps) {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState("A"); // A: Categoría, B: Selector
  const { toast } = useToast();

  const form = useForm<InsertSupporter>({
    resolver: zodResolver(insertSupporterSchema),
    defaultValues: {
      name: "",
      neighborhood: "",
      neighborhoodType: "Barrio",
      phone: "",
      cedula: "",
      familySize: "",
      ageRange: "",
      status: "nuevo",
      origin: "web_modal",
    },
  });

  const neighborhoodType = form.watch("neighborhoodType");

  const mutation = useMutation({
    mutationFn: async (data: InsertSupporter) => {
      const res = await apiRequest("POST", "/api/supporters", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/supporters/count"] });
      toast({
        title: "¡Gracias por sumarte!",
        description: "Tus datos han sido registrados correctamente.",
      });
      
      // WhatsApp redirection
      const message = `Hola, soy ${data.name} de ${data.neighborhoodType} ${data.neighborhood}. Quiero sumarme al equipo.`;
      const whatsappUrl = `https://wa.me/595981123456?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      
      onOpenChange(false);
      setStep(1);
      setSubStep("A");
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    const values = form.getValues();
    if (step === 1) {
      if (subStep === "A" && !values.neighborhoodType) return;
      if (subStep === "B" && !values.neighborhood) return;
      
      if (subStep === "A") {
        setSubStep("B");
        return;
      }
    }
    if (step === 2 && !values.familySize) return;
    if (step === 3 && !values.ageRange) return;
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step === 1 && subStep === "B") {
      setSubStep("A");
      return;
    }
    setStep((s) => s - 1);
  };

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const progress = (step / 4) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Paso {step} de 4
          </DialogTitle>
          <Progress value={progress} className="h-2 mt-2" />
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${subStep}`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            {step === 1 && subStep === "A" && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">¿Dónde vivís?</Label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.keys(ZONAS).map((tipo) => (
                    <Button
                      key={tipo}
                      variant={form.watch("neighborhoodType") === tipo ? "default" : "outline"}
                      className="h-16 text-md justify-start px-6"
                      onClick={() => {
                        form.setValue("neighborhoodType", tipo);
                        form.setValue("neighborhood", ""); // Reset neighborhood when type changes
                        nextStep();
                      }}
                    >
                      <span className="mr-3 text-xl">
                        {tipo === "Barrio" && "🏘"}
                        {tipo === "Compañía / Localidad" && "🌾"}
                        {tipo === "Asentamiento" && "🏕"}
                        {tipo === "Comunidad Indígena" && "🧑‍🌾"}
                      </span>
                      {tipo}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && subStep === "B" && (
              <div className="space-y-4">
                <Label className="text-lg font-medium capitalize">Seleccioná tu {neighborhoodType}</Label>
                <div className="space-y-4">
                  <Select 
                    onValueChange={(value) => {
                      form.setValue("neighborhood", value);
                    }}
                    value={form.watch("neighborhood")}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder={`Seleccionar ${neighborhoodType}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {neighborhoodType && ZONAS[neighborhoodType as keyof typeof ZONAS].map((zona) => (
                        <SelectItem key={zona} value={zona}>
                          {zona}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    className="w-full h-12 text-lg font-bold"
                    disabled={!form.watch("neighborhood")}
                    onClick={nextStep}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">¿Cuántas personas viven en tu familia?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {FAMILY_SIZES.map((size) => (
                    <Button
                      key={size}
                      variant={form.watch("familySize") === size ? "default" : "outline"}
                      className="h-20 text-xl font-bold"
                      onClick={() => {
                        form.setValue("familySize", size);
                        nextStep();
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">¿Qué edad tenés?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {AGE_RANGES.map((range) => (
                    <Button
                      key={range}
                      variant={form.watch("ageRange") === range ? "default" : "outline"}
                      className="h-16 text-lg"
                      onClick={() => {
                        form.setValue("ageRange", range);
                        nextStep();
                      }}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" {...form.register("name")} placeholder="Tu nombre y apellido" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cedula">Número de cédula</Label>
                  <Input id="cedula" {...form.register("cedula")} placeholder="Ej: 1.234.567" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                  <Input id="phone" {...form.register("phone")} placeholder="Ej: 0981 123 456" required />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider text-center pt-2">
                  “TUS DATOS SON CONFIDENCIALES Y SERÁN UTILIZADOS ÚNICAMENTE POR EL EQUIPO DE CAMPAÑA.”
                </p>
                <Button type="submit" className="w-full h-12 text-lg font-bold mt-4" disabled={mutation.isPending}>
                  {mutation.isPending ? "Procesando..." : "Confirmar y continuar"}
                </Button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        {(step > 1 || (step === 1 && subStep === "B")) && step < 4 && (
          <Button variant="ghost" onClick={prevStep} className="mt-2">
            Volver
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}