import { motion } from 'framer-motion';
import { Shield, Store, MenuSquare, TrendingUp, Users, Search, Bell, DollarSign, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Using a custom FadeIn placeholder here, but ideal would be to pass it as a prop or keep local
const FadeIn = ({ children, delay = 0, direction = 'up' }: any) => {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 }
    };
    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction as keyof typeof directions] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export function DashboardMockup() {
    return (
        <section className="relative mt-8 pb-24 z-20 px-4 sm:px-6">
            <FadeIn delay={0.4}>
                <div className="max-w-6xl mx-auto relative group perspective-[2000px]">
                    {/* Efeito Glow atras do Dashboard */}
                    <div className="absolute inset-[-2%] rounded-3xl bg-gradient-to-r from-primary via-orange-500 to-indigo-500 blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-tilt"></div>

                    <motion.div
                        initial={{ rotateX: 20, y: 50, opacity: 0 }}
                        animate={{ rotateX: 0, y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
                        className="relative rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl p-2 md:p-4 overflow-hidden"
                    >
                        <div className="w-full h-[60vh] md:h-[70vh] rounded-xl bg-card border border-border flex flex-col overflow-hidden relative">
                            {/* Mockup Header */}
                            <div className="h-12 border-b border-border flex items-center px-4 bg-muted/30">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto bg-background border border-border rounded-md px-3 py-1 text-xs text-muted-foreground w-1/3 text-center flex items-center justify-center">
                                    <Shield className="w-3 h-3 mr-1" /> buzz-boost-magic.com
                                </div>
                            </div>
                            {/* Mockup Content (Realistic POS/Dashboard) */}
                            <div className="flex-1 flex overflow-hidden bg-muted/10">
                                {/* Sidebar */}
                                <div className="w-16 md:w-56 bg-background border-r border-border flex flex-col p-4 gap-6 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-3 text-primary font-bold">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Store className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="hidden md:block text-lg tracking-tight">DopplerDine</span>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
                                            <MenuSquare className="w-5 h-5 flex-shrink-0" />
                                            <span className="hidden md:block text-sm font-semibold">POS Register</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors">
                                            <TrendingUp className="w-5 h-5 flex-shrink-0" />
                                            <span className="hidden md:block text-sm font-medium">Reports</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors">
                                            <Users className="w-5 h-5 flex-shrink-0" />
                                            <span className="hidden md:block text-sm font-medium">CRM Clients</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Dashboard Area */}
                                <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
                                    {/* Top Action Bar */}
                                    <div className="flex justify-between items-center z-10">
                                        <div className="hidden sm:block">
                                            <h3 className="font-bold text-xl text-foreground tracking-tight">Overview</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Track your sales in real time.</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative bg-background border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm w-32 md:w-64">
                                                <Search className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground hidden md:inline">Search orders...</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm relative">
                                                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <Bell className="w-4 h-4 text-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10">
                                        {/* Card 1 */}
                                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                                            <div className="flex justify-between items-start mb-2 relative z-10">
                                                <div className="flex items-center gap-2 text-primary font-semibold">
                                                    <DollarSign className="w-4 h-4" /> Sales Today
                                                </div>
                                                <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none font-bold">+12.5%</Badge>
                                            </div>
                                            <div className="text-3xl md:text-4xl font-extrabold text-foreground relative z-10 mt-3 tracking-tight">
                                                <span className="text-primary/70 text-2xl mr-1">$</span>4,250<span className="text-muted-foreground text-2xl">.80</span>
                                            </div>
                                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                        </div>

                                        {/* Card 2 */}
                                        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground font-semibold mb-2">
                                                <Users className="w-4 h-4" /> Tickets Paid
                                            </div>
                                            <div className="text-3xl md:text-4xl font-bold text-foreground mt-3 tracking-tight">184</div>
                                        </div>

                                        {/* Card 3 */}
                                        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground font-semibold mb-2">
                                                <Activity className="w-4 h-4" /> Avg Ticket
                                            </div>
                                            <div className="text-3xl md:text-4xl font-bold text-foreground mt-3 tracking-tight">
                                                <span className="text-muted-foreground text-xl text-primary/70 mr-1">$</span>23<span className="text-muted-foreground text-2xl">.10</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Area - Tables / Orders */}
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 z-10">
                                        {/* Tables Grid */}
                                        <div className="xl:col-span-2 bg-background border border-border rounded-2xl p-5 shadow-sm flex flex-col">
                                            <h4 className="font-bold text-foreground mb-4">Floor Tables</h4>
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((table) => {
                                                    const isOccupied = table === 2 || table === 5 || table === 8;
                                                    return (
                                                        <div key={table} className={`aspect-square rounded-xl border flex flex-col justify-center items-center gap-1 transition-all duration-300 ${isOccupied ? 'bg-primary/10 border-primary/30 text-primary shadow-sm hover:bg-primary/20 cursor-pointer scale-105' : 'bg-muted/20 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 cursor-pointer'}`}>
                                                            <span className={`text-2xl font-black ${isOccupied ? 'text-primary' : 'text-foreground/50'}`}>{table}</span>
                                                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isOccupied ? 'text-primary' : 'text-muted-foreground'}`}>{isOccupied ? 'OCCUPIED' : 'FREE'}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Recent Orders List */}
                                        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm flex flex-col hidden md:flex">
                                            <h4 className="font-bold text-foreground mb-4">Kitchen (KDS)</h4>
                                            <div className="space-y-3 flex-1 overflow-hidden relative">
                                                {/* Fading border top/bottom */}
                                                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>

                                                <div className="pt-2 space-y-3">
                                                    {[
                                                        { id: '#1045', items: '2x Chicken Smash, 1x...', status: 'Prep', color: 'bg-orange-500/10 text-orange-500 border border-orange-500/20', time: 'Now' },
                                                        { id: '#1044', items: '1x Med Pizza, 2x Beer', status: 'Ready', color: 'bg-green-500/10 text-green-500 border border-green-500/20', time: '2 min' },
                                                        { id: '#1043', items: 'Sparkling Water, Salad', status: 'Delivered', color: 'bg-muted/50 text-muted-foreground border border-border/50', time: '15 min' },
                                                        { id: '#1042', items: 'Steak Special + Fries', status: 'Delivered', color: 'bg-muted/50 text-muted-foreground border border-border/50', time: '32 min' },
                                                    ].map((order, i) => (
                                                        <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 shadow-sm bg-muted/10">
                                                            <div>
                                                                <div className="flex gap-2 items-center">
                                                                    <span className="font-bold text-sm text-foreground">{order.id}</span>
                                                                    <span className="text-[10px] text-muted-foreground font-medium">{order.time}</span>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-0.5 truncate w-32 xl:w-40">{order.items}</div>
                                                            </div>
                                                            <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold tracking-wide shadow-sm ${order.color}`}>{order.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Background abstract decoration on main area */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </FadeIn>
        </section>
    );
}
