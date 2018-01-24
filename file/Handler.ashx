<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Net;
using System.Text;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;

public class Handler : IHttpHandler
{
    public string qingurl = "39.108.200.43:6420"; // 192.168.230.99:8082    //120.77.75.232  //120.77.54.99 119.23.142.92/ //120.77.58.193
    public void ProcessRequest(HttpContext context)
    {


        context.Response.ContentType = "text/plain";
        string url = context.Request["url"];
        if (url != null)
        {
            url = url.Replace("{$qingurl$}", qingurl);
        }
        string sessionId = "";
        url = url.Replace('|', '&');
        url = url.Replace("&sessionId=", "*");

        if (context.Request.RequestType.ToUpper() == "POST")
        {


            ////string uid = context.Request.Form["userId"];
            string[] allkey = context.Request.Form.AllKeys;
            string pars = "";
            for (int i = 0; i < allkey.Length; i++)
            {
                if (i == 0)
                    pars = allkey[i].ToString() + "=" + context.Request.Form[allkey[i].ToString()];
                else
                    pars += "&" + allkey[i].ToString() + "=" + context.Request.Form[allkey[i].ToString()];
            }

            context.Response.Write(SendUrl(true, url.Split('*')[0], url.Split('*')[1].Replace("\"", ""), pars));
        }
        else
        {
            try
            {
                context.Response.Write(SendUrl(false, url.Split('*')[0], url.Split('*')[1].Replace("\"", "")));
            }
            catch (Exception)
            {

                context.Response.Write(SendUrl(false, url.Split('*')[0], ""));
            }

        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }



    private string SendUrl(bool flag, string url, string sessionid, string postStr = "")
    {
        string str = string.Empty;
        try
        {
            HttpWebRequest wReq = (HttpWebRequest)WebRequest.Create(url);
            CookieContainer cookieContainer = new CookieContainer();

            Cookie cookie = new Cookie("sessionId", sessionid);
            cookie.Domain = qingurl.Split(':')[0];
            //cookie.Domain = "120.77.75.232";

            //cookie.Domain = "192.168.230.253";
            //cookie.Domain = "192.168.230.224";

            cookieContainer.Add(cookie);
            wReq.CookieContainer = cookieContainer;


            if (flag)
            {
                wReq.ContentType = "application/x-www-form-urlencoded";
                wReq.Method = "Post";
                wReq.Headers.Set("sessionId", sessionid);
                Stream myRequestStream = wReq.GetRequestStream();

                //StreamWriter myStreamWriter = new StreamWriter(myRequestStream, Encoding.GetEncoding("utf-8"));
                StreamWriter myStreamWriter = new StreamWriter(myRequestStream, Encoding.GetEncoding("gb2312"));
                myStreamWriter.Write(postStr);
                myStreamWriter.Close();

            }
            else
            {
                wReq.Method = "Get";
            }

            wReq.KeepAlive = false;

            wReq.Timeout = 999999999;
            HttpWebResponse wResp = (HttpWebResponse)wReq.GetResponse();
            string str1 = "";
            if (wResp.Headers.Get("set-cookie") != null)
            {
                str1 = wResp.Headers.Get("set-cookie").Split(';')[0].Split('=')[1];
            }


            System.IO.Stream respStream = wResp.GetResponseStream();

            JavaScriptSerializer js = new JavaScriptSerializer();
            using (System.IO.StreamReader reader = new System.IO.StreamReader(respStream, Encoding.UTF8))
            {

                if (url.Contains("login.json"))
                {
                    Login login = (Login)js.Deserialize(reader.ReadToEnd(), (new Login()).GetType());
                    login.sessionid = str1;
                    str = js.Serialize(login);
                }
                else
                {
                    str = reader.ReadToEnd();
                }

            };
        }
        catch (Exception ex)
        {
            str = ex.ToString();
        }

        return str;
    }

}

////{"flag":1,"obj":{"accountType":3
//,"corpName":"博实结"
////,"groupId":0
//,"name":"system"
//,"parentId":-1
////,"password":"123"
//,"phone":"13545265859
//","userId":1
////,"vehicleLimited":"100000000"}}

public class Login
{
    public int flag { get; set; }
    public Loginobj obj { get; set; }
    public string sessionid { get; set; }

}

public class Loginobj
{
    public string customCode { get; set; }
    public int accountType { get; set; }
    public string corpName { get; set; }
    public int groupId { get; set; }
    public string name { get; set; }
    public int parentId { get; set; }
    public string password { get; set; }
    public string phone { get; set; }
    public int userId { get; set; }
    public string vehicleLimited { get; set; }
    public string setItem { get; set; }
    public string checkGroup { set; get; }
    public bool cd149 { set; get; }
}

public static class Help
{

    public static List<T> JSONStringToList<T>(this string JsonStr)
    {
        JavaScriptSerializer Serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        List<T> objs = Deserialize<List<T>>(JsonStr);
        return objs;
    }

    public static T Deserialize<T>(string json)
    {
        T obj = Activator.CreateInstance<T>();
        using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(json)))
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
            return (T)serializer.ReadObject(ms);
        }
    }
}