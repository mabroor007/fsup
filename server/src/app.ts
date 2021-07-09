import SocketIo from "socket.io";

const io = new SocketIo.Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("hai", () => {
    socket.emit("hai", "hello");
  });
});

const PORT = process.env.PORT || 4000;
const TESTING = process.env.TESTING || false;

if (Boolean(TESTING) === false) {
  io.listen(Number(PORT));
  console.log("server started on port " + PORT);
}

export default io;
