import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

export default function WebSocketUIDScanner() {
  const [uid, setUid] = useState("");
  const [status, setStatus] = useState("Déconnecté");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.100.114:81");

    ws.onopen = () => {
      setStatus("Connecté");
      setIsScanning(true);
    };

    ws.onmessage = (message) => {
      setUid(message.data);
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 2000);
    };

    ws.onclose = () => {
      setStatus("Déconnecté");
      setIsScanning(false);
    };

    ws.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
      setStatus("Erreur");
      setIsScanning(false);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">Tableau de bord du scanner RFID</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Statut du scanner</h2>
          <div className="flex flex-col items-center">
            <motion.div
              className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-gray-100"
              animate={{
                scale: isScanning ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {status === "Connecté" ? (
                isScanning ? (
                  <CreditCardIcon className="h-20 w-20 text-blue-500" />
                ) : (
                  <CheckCircleIcon className="h-20 w-20 text-green-500" />
                )
              ) : (
                <XCircleIcon className="h-20 w-20 text-red-500" />
              )}
            </motion.div>
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold mb-2 ${
                status === "Connecté" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </span>
            <div className="flex items-center gap-2">
              <WifiIcon className={status === "Connecté" ? "text-green-500" : "text-red-500"} />
              <span>{status === "Connecté" ? "En ligne" : "Hors ligne"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations de la carte scannée</h2>
          <AnimatePresence mode="wait">
            {uid ? (
              <motion.div
                key="uid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-lg bg-green-50 p-4"
              >
                <p className="mb-2 text-sm font-medium text-green-800">Carte détectée !</p>
                <p className="text-2xl font-bold text-green-900">{uid}</p>
              </motion.div>
            ) : (
              <motion.div
                key="no-uid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-lg bg-gray-50 p-4"
              >
                <p className="text-sm font-medium text-gray-500">En attente d'une carte...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}