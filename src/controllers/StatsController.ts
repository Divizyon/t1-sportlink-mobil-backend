import { Request, Response, NextFunction } from 'express';
import StatsService from '../services/StatsService';

class StatsController {
    /**
     * @description Get weekly participation statistics
     * @access Private (adjust based on authentication)
     */
    static async getWeeklyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const weeklyData = await StatsService.fetchWeeklyStats();
            res.status(200).json(weeklyData);
        } catch (error) {
            next(error); // Pass error to the error handling middleware
        }
    }

    /**
     * @description Get participant distribution by sport category
     * @access Private (adjust based on authentication)
     */
    static async getCategoryDistribution(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryData = await StatsService.fetchCategoryDistribution();
            res.status(200).json(categoryData);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @description Get monthly event statistics by status
     * @access Private
     */
    static async getMonthlyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const monthlyData = await StatsService.fetchMonthlyStats();
            res.status(200).json(monthlyData);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @description Get user growth by sport category over the last 30 days
     * @access Private
     */
    static async getUserCategoryGrowth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userGrowthData = await StatsService.fetchUserCategoryGrowth();
            res.status(200).json(userGrowthData);
        } catch (error) {
            next(error);
        }
    }
}

export default StatsController; 