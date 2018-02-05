# HTML规范
### **1.前言**
#### 尽量的使用外联样式写 , 保持html的简洁及可阅读性
### **1.代码风格**
***
#### 1.1 **代码缩进**
##### **[建议] 使用 4 个空格做为一个缩进层级，第一级与标签对齐**
```
<style>
div {
    margin:10px 10px 0 10px;
}
</style>

<script>
(function (w,$) {
    var i = 0
	
	if(i > 0){
	    i++
	}
}(window,$))
</script>

```

#### 1.2 **命名**

##### [强制]  **class 单词全字母小写以及 Id 必须保证页面的唯一性**
##### [强制]  **class 必须单词全字母小写，单词之间以 - 分隔。**

```
<!-- good -->
<div class="sidebar"></div>

<!-- bad -->
<div class="left"></div>

```

#### 1.3 **引入文件规范**

##### **[强制] 结构-样式-行为的代码分离**

#### 1.4 **标签**

#####  **[强制]标签名必须使用小写字母**
##### **[强制] 标签使用必须符合标签嵌套规则。**
```
<!-- good -->
<div>
    <p>这是一个段落</p>
	<ul>
		<li></li>
	</ul>
</div>

<!-- bad -->
<div>
	<p>
		<div></div>
	</p>
	<ul>
		<div></div>
		<img/>
	</ul>
</div>
```
##### **[建议] 标签的使用应尽量简洁，减少不必要的标签。**

```
<!-- good -->
<img class="avatar" src="image.png">

<!-- bad -->
<span class="avatar">
    <img src="image.png">
</span>
```

##### **[强制] 属性值必须用双引号包围。**
```
<!-- good -->
<img src="image.png" />

<!-- bad -->
<img src='image.png' />
<img src=image.png />
```
##### **[强制] 属性值不允许为空** 

#### 1.5 **favicon**

##### **[强制] 保证favicon图片可访问**
##### 1.将favicon.icon放置在根目录下
##### 2.使用 link 指定 favicon。

#### 1.6 **注释**

##### **[强制] 容器注释以及描述注释**

