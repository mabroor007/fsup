import { Database } from "arangojs";
import { Socket } from "socket.io";
import { UserService } from "../users";

const SocketHandler = (socket: Socket, _db: Database) => {
  const userService = new UserService(_db);

  socket.on("hai", () => {
    socket.emit("hai", "hello");
  });
};

export default SocketHandler;
