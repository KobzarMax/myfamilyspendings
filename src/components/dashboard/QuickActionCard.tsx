import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardHoverVariants } from '../../lib/animations';

interface QuickActionCardProps {
    to: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function QuickActionCard({ to, icon: Icon, title, description }: QuickActionCardProps) {
    return (
        <motion.div
            variants={cardHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="h-full"
        >
            <Link
                to={to}
                className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-primary/20 bg-card p-6 text-center shadow-sm transition-all hover:bg-primary/5 hover:border-primary/50"
            >
                <div className="rounded-full bg-primary/10 p-3 mb-3 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </Link>
        </motion.div>
    );
}
