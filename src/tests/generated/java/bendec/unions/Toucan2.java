package bendec.unions;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.nio.ByteBuffer;
import bendec.unions.JsonSerializable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.TextNode;


/**
 * <h2>Toucan2</h2>

 * <p>Byte length: 3</p>
 * <p>Header header - undefined | size 1</p>
 * <p>u16 > int wingspan - undefined | size 2</p>
 * */

public class Toucan2 implements ByteSerializable, JsonSerializable, Animal2 {

    private Header header;
    private int wingspan;
    public static final int byteLength = 3;

    public Toucan2(Header header, int wingspan) {
        this.header = header;
        this.wingspan = wingspan;
        this.header.setLength(this.byteLength);
        this.header.setMsgType(MsgType.TOUCAN2);
    }

    public Toucan2(byte[] bytes, int offset) {
        this.header = new Header(bytes, offset);
        this.wingspan = BendecUtils.uInt16FromByteArray(bytes, offset + 1);
        this.header.setLength(this.byteLength);
        this.header.setMsgType(MsgType.TOUCAN2);
    }

    public Toucan2(byte[] bytes) {
        this(bytes, 0);
    }

    public Toucan2() {
    }



    public Header getHeader() {
        return this.header;
    };
    public int getWingspan() {
        return this.wingspan;
    };

    public void setHeader(Header header) {
        this.header = header;
    };
    public void setWingspan(int wingspan) {
        this.wingspan = wingspan;
    };


    @Override  
    public byte[] toBytes() {
        ByteBuffer buffer = ByteBuffer.allocate(this.byteLength);
        header.toBytes(buffer);
        buffer.put(BendecUtils.uInt16ToByteArray(this.wingspan));
        return buffer.array();
    }

    @Override  
    public void toBytes(ByteBuffer buffer) {
        header.toBytes(buffer);
        buffer.put(BendecUtils.uInt16ToByteArray(this.wingspan));
    }

    @Override  
    public ObjectNode toJson() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode object = mapper.createObjectNode();
        object.set("header", header.toJson());
        object.put("wingspan", wingspan);
        return object;
    }

    @Override  
    public ObjectNode toJson(ObjectNode object) {
        object.set("header", header.toJson());
        object.put("wingspan", wingspan);
        return object;
    }

    @Override
    public int hashCode() {
        return Objects.hash(header, wingspan);
    }

    @Override
    public String toString() {
        return "Toucan2{" +
            "header=" + header +
            ", wingspan=" + wingspan +
            '}';
        }
}
