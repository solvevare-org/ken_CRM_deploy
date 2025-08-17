
import React from 'react';
import { Home, Building2, Users, BarChart3, Calendar, FileText, Target, CheckSquare, UserPlus, User, X, Settings, MessageSquare, Send, Bell, MessageCircle } from 'lucide-react';

interface SidebarProps {
	activeSection: string;
	setActiveSection: (section: string) => void;
	isMobileMenuOpen: boolean;
	setIsMobileMenuOpen: (open: boolean) => void;
}

const menuItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: Home },
	{ id: 'properties', label: 'Properties', icon: Building2 },
	{ id: 'clients', label: 'Clients', icon: Users },
	{ id: 'leads', label: 'Leads', icon: UserPlus },
	{ id: 'analytics', label: 'Analytics', icon: BarChart3 },
	{ id: 'notifications', label: 'Notifications', icon: Bell },
	{ id: 'messaging', label: 'Messages', icon: MessageCircle },
	{ id: 'tasks', label: 'Tasks', icon: CheckSquare },
	{ id: 'documents', label: 'Documents', icon: FileText },
	{ id: 'marketing', label: 'Campaigns', icon: Target },
	{ id: 'calendar', label: 'Calendar', icon: Calendar },
	{
		id: 'followup-management',
		label: 'Follow-up Management',
		icon: MessageSquare,
		children: [
			{ id: 'followup', label: 'Follow-up', icon: Send },
			{ id: 'followup-templating', label: 'Follow-up Templating', icon: FileText },
		],
	},
	{
		id: 'leadform-management',
		label: 'Lead Form Management',
		icon: User,
		children: [
			{ id: 'leadform', label: 'Lead Form', icon: FileText },
			{ id: 'leadform-templating', label: 'Lead Form Templating', icon: Settings },
		],
	},
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isMobileMenuOpen, setIsMobileMenuOpen }) => {
	const handleMenuItemClick = (sectionId: string) => {
		setActiveSection(sectionId);
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			{/* Mobile backdrop */}
			{isMobileMenuOpen && (
				<div 
					className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
			{/* Sidebar */}
			<div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:translate-x-0 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				{/* Header */}
				<div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<Building2 className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-900">RealtyPro</span>
					</div>
					{/* Mobile close button */}
					<button
						onClick={() => setIsMobileMenuOpen(false)}
						className="lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100"
					>
						<X className="w-5 h-5 text-gray-600" />
					</button>
				</div>
				{/* Navigation (scrollable) */}
				<nav className="mt-8 px-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
					{menuItems.map((item) => {
						if (item.children) {
							const ParentIcon = item.icon;
							return (
								<div key={item.id} className="">
									<div className="flex items-center space-x-3 px-4 py-3 font-semibold text-gray-700">
										<ParentIcon className="w-5 h-5 flex-shrink-0" />
										<span>{item.label}</span>
									</div>
									<div className="ml-8 space-y-1">
										{item.children.map((child) => {
											const ChildIcon = child.icon;
											return (
												<button
													key={child.id}
													onClick={() => handleMenuItemClick(child.id)}
													className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
														activeSection === child.id
															? 'bg-blue-50 text-blue-600'
															: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
													}`}
												>
													<ChildIcon className="w-4 h-4 flex-shrink-0" />
													<span className="font-normal">{child.label}</span>
												</button>
											);
										})}
									</div>
								</div>
							);
						} else {
							const Icon = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => handleMenuItemClick(item.id)}
									className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
										activeSection === item.id
											? 'bg-blue-50 text-blue-600'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									}`}
									aria-label={item.label}
								>
									<Icon className="w-5 h-5 flex-shrink-0" />
									<span className="font-medium">{item.label}</span>
								</button>
							);
						}
					})}
				</nav>
				{/* Bottom section */}
				<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
							<User className="w-4 h-4 text-gray-600" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 truncate">Sarah Johnson</p>
							<p className="text-xs text-gray-500">Real Estate Agent</p>
						</div>
						<Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
