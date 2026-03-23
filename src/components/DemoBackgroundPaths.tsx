import { BackgroundPaths } from "@/components/ui/background-paths"

export function DemoBackgroundPaths({ onStart }: { onStart: () => void }) {
    return <BackgroundPaths title="Student ID Maker" onStart={onStart} />
}
