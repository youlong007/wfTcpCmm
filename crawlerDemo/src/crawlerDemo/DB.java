package crawlerDemo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DB {

    public Connection conn = null;

    public DB() {
        try {
            Class.forName("com.mysql.jdbc.Driver");   //加载驱动
//            String url = "jdbc:mysql://localhost:3306/Crawler";
//            conn = DriverManager.getConnection(url, "root", "123456");
            String url = "jdbc:mysql://123.57.69.169:3306/airup_dev";
            conn = DriverManager.getConnection(url, "zhanghongwei", "zhw123");
            System.out.println("conn built");
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public ResultSet runSql(String sql) throws SQLException {
        Statement sta = conn.createStatement();
        return sta.executeQuery(sql);
    }

    public boolean runSql2(String sql) throws SQLException {
        Statement sta = conn.createStatement();
        return sta.execute(sql);       //执行给定SQL语句，返回布尔值
    }

    @Override
    protected void finalize() throws Throwable {
        if (conn != null || !conn.isClosed()) {
            conn.close();
        }
    }
    public static void main(String[] args) {
        new DB();
    }
}