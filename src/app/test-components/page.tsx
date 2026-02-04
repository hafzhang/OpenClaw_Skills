import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TestComponentsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">shadcn/ui 组件测试</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card 组件</CardTitle>
            <CardDescription>这是一个卡片组件测试</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card 内容区域</p>
          </CardContent>
        </Card>

        <div className="flex gap-4 items-center">
          <Button>默认按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
        </div>

        <div className="max-w-sm">
          <Input placeholder="输入框测试" />
        </div>

        <div className="flex gap-2">
          <Badge>默认标签</Badge>
          <Badge variant="secondary">次要标签</Badge>
          <Badge variant="outline">轮廓标签</Badge>
        </div>
      </div>
    </div>
  );
}
