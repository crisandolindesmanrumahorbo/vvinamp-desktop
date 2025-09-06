// import { useState, useEffect } from "react";
// import { readDir } from "@tauri-apps/plugin-fs";
//
// type Song = {
//   name: string;
//   path: string;
//   displayName: string;
// };
//
// const SongList = () => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentSong, setCurrentSong] = useState<Song | null>(null);
//   const [error, setError] = useState<string | null>(null);
//
//   // Common music directories on Android
//   const musicPaths = [
//     "/storage/emulated/0/Music",
//     "/storage/emulated/0/Download",
//     "/sdcard/Music",
//     "/sdcard/Download",
//   ];
//
//   const loadSongs = async () => {
//     try {
//       setLoading(true);
//       const allSongs: Song[] = [];
//
//       for (const path of musicPaths) {
//         try {
//           const entries = await readDir(path);
//           const musicFiles = entries.filter(
//             (entry) =>
//               entry.isFile && /\.(mp3|wav|ogg|m4a|flac)$/i.test(entry.name),
//           );
//
//           musicFiles.forEach((file) => {
//             allSongs.push({
//               name: file.name,
//               path: `${path}/${file.name}`,
//               displayName: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
//             });
//           });
//         } catch (err) {
//           console.log(`Could not read directory ${path}:`, err);
//         }
//       }
//
//       setSongs(allSongs);
//       setError(null);
//     } catch (err) {
//       console.error("Error loading songs:", err);
//       setError("Failed to load songs. Please check permissions.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const playSong = (song: Song) => {
//     setCurrentSong(song);
//     // You can add more logic here to actually play the song
//     console.log("Playing:", song.name);
//   };
//
//   useEffect(() => {
//     loadSongs();
//   }, []);
//
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         <span className="ml-3 text-lg">Loading songs...</span>
//       </div>
//     );
//   }
//
//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 border border-red-400 rounded-md">
//         <p className="text-red-700">{error}</p>
//         <button
//           onClick={loadSongs}
//           className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }
//
//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Songs ({songs.length})</h2>
//         <button
//           onClick={loadSongs}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Refresh
//         </button>
//       </div>
//
//       {songs.length === 0 ? (
//         <p className="text-gray-500 text-center py-8">
//           No songs found. Make sure you have music files in your Music or
//           Download folders.
//         </p>
//       ) : (
//         <div className="space-y-2">
//           {songs.map((song, index) => (
//             <div
//               key={index}
//               className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                 currentSong?.path === song.path
//                   ? "bg-blue-100 border-blue-300"
//                   : "bg-white border-gray-200 hover:bg-gray-50"
//               }`}
//               onClick={() => playSong(song)}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-medium text-gray-900 truncate">
//                     {song.displayName}
//                   </h3>
//                   <p className="text-sm text-gray-500 truncate">{song.path}</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   {currentSong?.path === song.path && (
//                     <span className="text-blue-500 text-sm">♪ Playing</span>
//                   )}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       playSong(song);
//                     }}
//                     className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
//                   >
//                     Play
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//
//       {currentSong && (
//         <div className="mt-6 p-4 bg-gray-100 rounded-lg">
//           <h3 className="font-medium mb-2">Now Playing:</h3>
//           <p className="text-sm text-gray-700">{currentSong.displayName}</p>
//           <audio
//             controls
//             className="w-full mt-2"
//             src={`file://${currentSong.path}`}
//             autoPlay
//           >
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default SongList;
