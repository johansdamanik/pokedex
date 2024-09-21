import Pokeball from '@/components/PokeBall'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoadingDetailCard() {
  return (
    <Card className="h-[85vh] !rounded-none !border-none lg:!rounded-3xl flex w-full">
      <CardContent className="grow h-ful w-full flex items-center justify-center">
        <div className="animate-spin">
          <Pokeball size={100} color="gray" />
        </div>
      </CardContent>
    </Card>
  )
}
