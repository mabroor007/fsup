import io from "./app";
import SocketIo from "socket.io";
import Client, { Socket } from "socket.io-client";

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

describe("my awesome project", () => {
  let server: SocketIo.Socket, client: Socket;

  beforeAll((done) => {
    io.on("connection", (socket) => {
      server = socket;
    });
    io.listen(Number(PORT));
    client = Client(`http://${HOST}:${PORT}`);
    client.on("connect", done);
  });

  afterAll(() => {
    io.close();
    client.close();
  });

  test("should hai", (done) => {
    client.on("hai", (arg) => {
      expect(arg).toBe("hello");
      done();
    });
    client.emit("hai");
  });
});
