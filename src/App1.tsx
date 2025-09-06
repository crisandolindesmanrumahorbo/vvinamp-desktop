// // import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
// import { useState, useEffect } from "react";
// import { Plus, Users, Clock, CheckCircle } from "lucide-react";
// import "./App.css";
//
// function App1() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // const [greetMsg, setGreetMsg] = useState("");
//   // const [name, setName] = useState("");
//   //
//   // async function greet() {
//   //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//   //   setGreetMsg(await invoke("greet", { name }));
//   // }
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://jsonplaceholder.typicode.com/todos/1",
//         ); // Replace with your API endpoint
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchData();
//   }, []); // Empty dependency array ensures it runs only once o
//
//   const openWindow = async () => {
//     try {
//       // Generate a unique label (e.g., timestamp + random number)
//       const label = `window-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//       await invoke("open_new_window", { label });
//     } catch (error) {
//       console.error("Error opening window:", error);
//     }
//   };
//   return (
//     <main className="w-full min-h-screen">
//       <p>{JSON.stringify(data)}</p>
//       <button onClick={openWindow}>Open JS Window</button>
//       <HospitalQueue></HospitalQueue>
//     </main>
//   );
// }
//
// const HospitalQueue = () => {
//   const [queues, setQueues] = useState([
//     {
//       id: 1,
//       name: "LOKET 1",
//       type: "ANTRIAN PASIEN BPJS",
//       current: "P06",
//       waiting: 12,
//     },
//     {
//       id: 2,
//       name: "LOKET 2",
//       type: "ANTRIAN PASIEN UMUM",
//       current: "U07",
//       waiting: 8,
//     },
//   ]);
//
//   const [newPatient, setNewPatient] = useState({ name: "", type: "BPJS" });
//   const [currentTime, setCurrentTime] = useState(new Date());
//
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);
//
//   const addPatient = () => {
//     if (!newPatient.name.trim()) return;
//
//     const targetQueue = newPatient.type === "BPJS" ? 1 : 2;
//     setQueues((prev) =>
//       prev.map((queue) =>
//         queue.id === targetQueue
//           ? { ...queue, waiting: queue.waiting + 1 }
//           : queue,
//       ),
//     );
//
//     setNewPatient({ name: "", type: "BPJS" });
//   };
//
//   const nextPatient = (queueId: number) => {
//     setQueues((prev) =>
//       prev.map((queue) => {
//         if (queue.id === queueId && queue.waiting > 0) {
//           const prefix = queue.type.includes("BPJS") ? "P" : "U";
//           const currentNum = parseInt(queue.current.slice(1)) + 1;
//           const newCurrent = `${prefix}${currentNum.toString().padStart(2, "0")}`;
//
//           return {
//             ...queue,
//             current: newCurrent,
//             waiting: Math.max(0, queue.waiting - 1),
//           };
//         }
//         return queue;
//       }),
//     );
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 w-full">
//       {/* Header */}
//       <div className="bg-green-600 text-white p-6 text-center">
//         <div className="flex items-center justify-center gap-3 mb-2">
//           <div className="bg-white rounded-full p-2">
//             <Users className="h-8 w-8 text-green-600" />
//           </div>
//           <h1 className="text-2xl font-bold">PUSKESMAS KOTA SIDIKALANG</h1>
//         </div>
//         <h2 className="text-xl">SISTEM INFORMASI ANTRIAN</h2>
//         <div className="flex items-center justify-center gap-2 mt-2 text-sm">
//           <Clock className="h-4 w-4" />
//           <span>{currentTime.toLocaleString("id-ID")}</span>
//         </div>
//
//         <a href="google.com" target="_blank" rel="noopener noreferrer">
//           Link
//         </a>
//       </div>
//
//       <div className="container mx-auto p-6">
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Queue Display */}
//           <div className="lg:col-span-2 space-y-4">
//             {queues.map((queue) => (
//               <div
//                 key={queue.id}
//                 className="bg-white rounded-lg shadow-lg overflow-hidden"
//               >
//                 <div className="bg-green-500 text-white p-4">
//                   <h3 className="font-bold text-lg">{queue.name}</h3>
//                   <p className="text-sm opacity-90">{queue.type}</p>
//                 </div>
//
//                 <div className="p-6">
//                   <div className="text-center mb-4">
//                     <div className="text-sm text-gray-600 mb-2">
//                       Nomor Antrian
//                     </div>
//                     <div className="text-6xl font-bold text-green-600 mb-2">
//                       {queue.current}
//                     </div>
//                   </div>
//
//                   <div className="flex justify-between items-center mb-4">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-orange-500">
//                         {queue.waiting}
//                       </div>
//                       <div className="text-sm text-gray-600">Menunggu</div>
//                     </div>
//                     <button
//                       onClick={() => nextPatient(queue.id)}
//                       disabled={queue.waiting === 0}
//                       className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
//                     >
//                       <CheckCircle className="h-5 w-5" />
//                       Panggil Selanjutnya
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//
//           {/* Add Patient Form */}
//           <div className="space-y-6 text-black">
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
//                 <Plus className="h-5 w-5 " />
//                 Tambah Pasien Baru
//               </h3>
//
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Nama Pasien
//                   </label>
//                   <input
//                     type="text"
//                     value={newPatient.name}
//                     onChange={(e) =>
//                       setNewPatient({ ...newPatient, name: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Masukkan nama pasien"
//                   />
//                 </div>
//
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Jenis Pasien
//                   </label>
//                   <select
//                     value={newPatient.type}
//                     onChange={(e) =>
//                       setNewPatient({ ...newPatient, type: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   >
//                     <option value="BPJS">BPJS</option>
//                     <option value="UMUM">UMUM</option>
//                   </select>
//                 </div>
//
//                 <button
//                   onClick={addPatient}
//                   className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
//                 >
//                   Tambah ke Antrian
//                 </button>
//               </div>
//             </div>
//
//             {/* Queue Summary */}
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h3 className="text-lg font-bold mb-4">Ringkasan Antrian</h3>
//               <div className="space-y-3">
//                 {queues.map((queue) => (
//                   <div
//                     key={queue.id}
//                     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
//                   >
//                     <div>
//                       <div className="font-medium">{queue.name}</div>
//                       <div className="text-sm text-gray-600">
//                         {queue.type.includes("BPJS") ? "BPJS" : "UMUM"}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-lg font-bold text-green-600">
//                         {queue.current}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         {queue.waiting} menunggu
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default App1;
