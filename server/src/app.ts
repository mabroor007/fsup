import SocketIo from "socket.io";
import SocketHandler from "./SocketHandler";
import { Database } from "arangojs";

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "dev";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 8529;
const DB_USERNAME = process.env.DB_USERNAME || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "pwd";

class FsupServer {
  private io: SocketIo.Server;

  constructor(socketHandler: (socket: SocketIo.Socket, db: Database) => void) {
    // creating a socket server
    this.io = new SocketIo.Server({ cors: { origin: "*" } });

    // setup db
    this.getDatabase().then((db) => {
      this.io.on("connection", (socket) => socketHandler(socket, db));
    });
  }

  async getDatabase() {
    const db = new Database({
      url: `http://${DB_HOST}:${DB_PORT}`,
      auth: { username: DB_USERNAME, password: DB_PASSWORD },
    });

    if (NODE_ENV === "prod") return db;

    try {
      await db.createCollection("users");
      await db.createCollection("files");
    } catch (e) {}

    return db;
  }

  listen(port: number, cb: (port: number) => void) {
    this.io.listen(port);
    cb(port);
  }

  getIo() {
    return this.io;
  }
}

if (NODE_ENV !== "testing") {
  const server = new FsupServer(SocketHandler);
  server.listen(Number(PORT), (port) =>
    console.log(`Fsup Server running on port ${port}`)
  );
}

export default FsupServer;
